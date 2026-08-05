import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption"; // adjust to your actual path
import { connectDB } from "@/db/configDb"; // adjust to your actual path
import Save from "@/model/saves.model"; // adjust to your actual path/filename
import "@/model/book.model"; // ensures the Ebook model is registered before populate

// GET /api/profile/saved-books?page=1&limit=6
// Returns the books the logged-in user has saved, most recently saved first.
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
        const limit = Math.min(50, parseInt(searchParams.get("limit") || "6"));

        const [saves, total] = await Promise.all([
            Save.find({ user: session.user.id })
                .populate({
                    path: "book",
                    select: "name subtitle description coverImage views likesCount author",
                    populate: { path: "author", select: "username" },
                })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Save.countDocuments({ user: session.user.id }),
        ]);

        // A saved book may have been deleted/unpublished since — filter those out
        const books = saves?.map((s: any) => s.book).filter(Boolean);

        return NextResponse.json({
            books,
            total,
            page,
            hasMore: page * limit < total,
        });
    } catch (error) {
        console.error("Get saved books error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
