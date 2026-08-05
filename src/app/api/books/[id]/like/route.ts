import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import Ebook from "@/model/book.model";
import Like from "@/model/likes.model";
import { connectDB } from "@/db/configDb";

// GET /api/books/:id/like -> current count + whether the viewer has liked it
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const {id} = await params;
        await connectDB();
        const session = await getServerSession(authOptions);

        const book = await Ebook.findById(id).select("likesCount status isPublished");
        const isPublished = book?.isPublished || ["Published", "published"].includes(book?.status ?? "");
        if (!book || !isPublished) {
            return NextResponse.json({ message: "Book not found" }, { status: 404 });
        }

        let liked = false;
        if (session?.user?.id) {
            liked = !!(await Like.exists({ book: id, user: session.user.id }));
        }

        return NextResponse.json({ likesCount: book.likesCount, liked });
    } catch (error) {
        console.error("Get like status error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

// POST /api/books/:id/like -> toggles like for the logged-in user
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "You must be logged in to like a book" },
                { status: 401 }
            );
        }

        await connectDB();
        const {id : bookId} = await params;
        const userId = session.user.id;

        const bookToLike = await Ebook.findOne({
            _id: bookId,
            $or: [{ status: { $in: ["Published", "published"] } }, { isPublished: true }],
        });
        if (!bookToLike) {
            return NextResponse.json({ message: "Book not found" }, { status: 404 });
        }

        const existing = await Like.findOne({ book: bookId, user: userId });

        let liked: boolean;
        if (existing) {
            await existing.deleteOne();
            await Ebook.findByIdAndUpdate(bookId, { $inc: { likesCount: -1 } });
            liked = false;
        } else {
            await Like.create({ book: bookId, user: userId });
            await Ebook.findByIdAndUpdate(bookId, { $inc: { likesCount: 1 } });
            liked = true;
        }

        const book = await Ebook.findById(bookId).select("likesCount");
        return NextResponse.json({ liked, likesCount: book?.likesCount ?? 0 });
    } catch (error) {
        console.error("Toggle like error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
