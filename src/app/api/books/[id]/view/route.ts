import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import Ebook from "@/model/book.model";
import View from "@/model/views.model";
import { connectDB } from "@/db/configDb";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id: bookId } = await params;

        const bookToView = await Ebook.findOne({
            _id: bookId,
            $or: [{ status: { $in: ["Published", "published"] } }, { isPublished: true }],
        }).select("_id");
        if (!bookToView) {
            return NextResponse.json({ message: "Book not found" }, { status: 404 });
        }

        const session = await getServerSession(authOptions);
        const cookieStore = await cookies();

        const viewDoc: { book: string; user?: string; guestId?: string } = { book: bookId };
        let guestIdToSet: string | null = null;

        if (session?.user?.id) {
            viewDoc.user = session.user.id;
        } else {
            let guestId = cookieStore.get("guest_id")?.value;
            if (!guestId) {
                guestId = randomUUID();
                guestIdToSet = guestId;
            }
            viewDoc.guestId = guestId;
        }

        let counted = false;
        try {
            await View.create(viewDoc);
            counted = true;
        } catch (err: unknown) {
            const mongoErr = err as { code?: number };
            if (mongoErr.code !== 11000) throw err;
        }

        if (counted) {
            await Ebook.findByIdAndUpdate(bookId, { $inc: { views: 1 } });
        }

        const book = await Ebook.findById(bookId).select("views");

        const res = NextResponse.json({ views: book?.views ?? 0, counted });

        if (guestIdToSet) {
            res.cookies.set("guest_id", guestIdToSet, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 365,
                sameSite: "lax",
                path: "/",
            });
        }

        return res;
    } catch (error) {
        console.error("View tracking error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
