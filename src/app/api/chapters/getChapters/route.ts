// In your getChapters route file
import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/db/configDb";
import { Chapter } from "@/model/chapter.model";
import "@/model/user.model"; // Make sure this imports the User model
import "@/model/book.model"; // Make sure this imports the Ebook model

export async function GET(request: NextRequest) {
    await connectDB();

    try {
        const chapters = await Chapter.find()
            .populate({
                path: "author",
                select: "username" // Explicitly select only username
            })
            .populate({
                path: "bookId",
                select: "name" // Explicitly select only title
            })
            .lean(); // Add .lean() for better performance

        return NextResponse.json({ 
            message: "Get all chapters", 
            chapters 
        }, { status: 200 })
    } catch (error) {
        console.error("Error fetching chapters:", error);
        return NextResponse.json({ 
            message: "Error fetching chapters",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 })
    }
}