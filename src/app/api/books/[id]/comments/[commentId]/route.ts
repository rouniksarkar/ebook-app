import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import Comment from "@/model/comments.model";
import Ebook from "@/model/book.model";
import { connectDB } from "@/db/configDb";

// DELETE /api/books/:id/comments/:commentId -> only the comment's author can delete it
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; commentId: string }> }
) {
    try {
        const { id, commentId } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        // extra safety: make sure the comment actually belongs to the book in the URL
        if (comment.book.toString() !== id) {
            return NextResponse.json({ message: "Comment not found on this book" }, { status: 404 });
        }

        if (comment.user.toString() !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await comment.deleteOne();
        await Ebook.findByIdAndUpdate(id, { $inc: { commentsCount: -1 } });

        return NextResponse.json({ message: "Comment deleted" });
    } catch (error) {
        console.error("Delete comment error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}