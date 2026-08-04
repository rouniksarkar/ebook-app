import { NextResponse } from "next/server";
import { connectDB } from "@/db/configDb";
import Ebook from "@/model/book.model";

// GET /api/books/categories -> distinct, non-empty categories among published free books
export async function GET() {
    try {
        await connectDB();

        const categories = await Ebook.distinct("category", {
            access: { $in: ["Free", "free"] },
            status: "Published",
            category: { $nin: [null, ""] },
        });

        return NextResponse.json({ categories: categories.sort() }, { status: 200 });
    } catch (error: any) {
        console.error("Fetch categories error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}