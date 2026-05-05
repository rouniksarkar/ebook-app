import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/configDb";
import Ebook from "@/model/book.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    await connectDB()

    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ message: "Unauthorized." }, { status: 401 })
    }

    const book = await Ebook.findById(id);

    if (!book) {
        return NextResponse.json({ message: "Book not found." }, { status: 404 })
    }   
    return NextResponse.json({ message: "Book fetched successfully.", book }, { status: 200 })
}