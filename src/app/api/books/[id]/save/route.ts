import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import Ebook from "@/model/book.model";
import Save from "@/model/saves.model";
import { connectDB } from "@/db/configDb";

// GET /api/books/:id/save -> whether the viewer has saved this book
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const {id}= await params;
        await connectDB();
        const session = await getServerSession(authOptions);

        let saved = false;
        if (session?.user?.id) {
            saved = !!(await Save.exists({ book: id, user: session.user.id }));
        }

        return NextResponse.json({ saved });
    } catch (error) {
        console.error("Get save status error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

// POST /api/books/:id/save -> toggles save/bookmark for the logged-in user
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "You must be logged in to save a book" },
                { status: 401 }
            );
        }

        await connectDB();
        const {id:bookId} = await params;
        const userId = session.user.id;

        const existing = await Save.findOne({ book: bookId, user: userId });

        let saved: boolean;
        if (existing) {
            await existing.deleteOne();
            await Ebook.findByIdAndUpdate(bookId, { $inc: { savesCount: -1 } });
            saved = false;
        } else {
            await Save.create({ book: bookId, user: userId });
            await Ebook.findByIdAndUpdate(bookId, { $inc: { savesCount: 1 } });
            saved = true;
        }

        return NextResponse.json({ saved });
    } catch (error) {
        console.error("Toggle save error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}