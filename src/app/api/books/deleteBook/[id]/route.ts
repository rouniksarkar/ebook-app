import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import Ebook from "@/model/book.model";
import { Chapter } from "@/model/chapter.model";
import Comment from "@/model/comments.model";
import Like from "@/model/likes.model";
import Save from "@/model/saves.model";
import View from "@/model/views.model";
import { connectDB } from "@/db/configDb";

// DELETE /api/books/deleteBook/:id -> deletes a book and all its associated chapters & interactions
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: bookId } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "You must be logged in to delete a book" },
                { status: 401 }
            );
        }

        await connectDB();
        const userId = session.user.id;

        const book = await Ebook.findById(bookId);
        if (!book) {
            return NextResponse.json({ message: "Book not found" }, { status: 404 });
        }

        // Only the author is allowed to delete the book
        if (book.author.toString() !== userId) {
            return NextResponse.json(
                { message: "You are not authorized to delete this book" },
                { status: 403 }
            );
        }

        // Perform cascading deletion
        await Promise.all([
            Chapter.deleteMany({ bookId }),
            Comment.deleteMany({ book: bookId }),
            Like.deleteMany({ book: bookId }),
            Save.deleteMany({ book: bookId }),
            View.deleteMany({ book: bookId }),
            Ebook.findByIdAndDelete(bookId),
        ]);

        return NextResponse.json({ message: "Book and all associated content deleted successfully" });
    } catch (error) {
        console.error("Delete book error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
