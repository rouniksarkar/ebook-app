import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import Ebook from "@/model/book.model";
import Comment from "@/model/comments.model";
import { connectDB } from "@/db/configDb";

// GET /api/books/:id/comments?page=1&limit=10
// Returns top-level comments only (replies are excluded here; fetch per-comment if you add threading UI)
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const {id} = await params;
        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
        const limit = Math.min(50, parseInt(searchParams.get("limit") || "10"));

        const [comments, total] = await Promise.all([
            Comment.find({ book: id, parentComment: null })
                .populate("user", "username avatar")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Comment.countDocuments({ book: id, parentComment: null }),
        ]);

        return NextResponse.json({
            comments,
            total,
            page,
            hasMore: page * limit < total,
        });
    } catch (error) {
        console.error("List comments error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

// POST /api/books/:id/comments -> { content: string, parentComment?: string }
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const {id} = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "You must be logged in to comment" },
                { status: 401 }
            );
        }

        await connectDB();
        const body = await req.json();
        const content = typeof body.content === "string" ? body.content.trim() : "";
        const parentComment = body.parentComment || null;

        if (!content) {
            return NextResponse.json({ message: "Comment cannot be empty" }, { status: 400 });
        }
        if (content.length > 2000) {
            return NextResponse.json({ message: "Comment is too long" }, { status: 400 });
        }

        const comment = await Comment.create({
            book: id,
            user: session.user.id,
            content,
            parentComment,
        });

        await Ebook.findByIdAndUpdate(id, { $inc: { commentsCount: 1 } });

        await comment.populate("user", "username avatar");

        return NextResponse.json({ comment }, { status: 201 });
    } catch (error) {
        console.error("Create comment error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}