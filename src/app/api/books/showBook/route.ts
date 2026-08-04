import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/configDb";
import Ebook from "@/model/book.model";
import User from "@/model/user.model";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url)

        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 6;
        const sortBy = searchParams.get("sortBy") || "latest"; // latest | mostViewed | mostLiked
        const category = searchParams.get("category"); // e.g. "Fiction", or null/"All" for no filter

        const skip = (page - 1) * limit;

        const filter: Record<string, any> = {
            access: { $in: ["Free", "free"] },
            status: "Published"
        };

        if (category && category !== "All") {
            filter.category = category;
        }

        let sort: Record<string, 1 | -1> = { createdAt: -1 }; // latest (default)
        if (sortBy === "mostViewed") sort = { views: -1 };
        if (sortBy === "mostLiked") sort = { likesCount: -1 };

        const totalBooks = await Ebook.countDocuments(filter)

        // The query will now successfully map the 'ref' definition
        const books = await Ebook.find(filter)
            .populate('author', 'username')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            message: "Books fetched successfully.",
            books,
            currentPage: page,
            totalPages: Math.ceil(totalBooks / limit),
            totalBooks
        }, { status: 200 });
    } catch (error: any) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}