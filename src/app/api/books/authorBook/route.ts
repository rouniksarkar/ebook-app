import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/configDb";
import Ebook from "@/model/book.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import User from "@/model/user.model";

export async function GET(request: NextRequest) {

    await connectDB()

    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ message: "Unauthorized." }, { status: 401 })
    }

    const books = await Ebook.find({
        author:session.user.id
    }).populate("author","username");

    if (!books) {
        return NextResponse.json({ message: "Book not found." }, { status: 404 })
    }   
    return NextResponse.json({ message: "Book fetched successfully.", books }, { status: 200 })
}