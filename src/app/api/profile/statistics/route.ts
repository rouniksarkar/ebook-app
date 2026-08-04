import Ebook from "@/model/book.model";
import User from "@/model/user.model";
import { Chapter } from "@/model/chapter.model";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/configDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { log } from "node:console";

export async function GET(request: NextRequest) {

    try {
        await connectDB()

    const session = await getServerSession(authOptions);

    const totalBooks = await Ebook.countDocuments({
        author: session?.user.id
    })

    const publishedBooks = await Ebook.countDocuments({
        author: session?.user.id,
        status: "Published"
    });

    const draftBooks = await Ebook.countDocuments({
        author: session?.user.id,
        status: "Draft"
    });

    const totalChapters = await Chapter.countDocuments({
        author: session?.user.id
    });

    return NextResponse.json({
        message: "Stats are provided!",
        totalBooks,
        publishedBooks,
        draftBooks,
        totalChapters
    },
        { status: 200 }
    )
    } catch (error) {
        console.log("Error on providing stats!",error);      
    }

}