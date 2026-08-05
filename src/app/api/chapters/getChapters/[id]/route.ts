import { connectDB } from "@/db/configDb";
import { authOptions } from "@/lib/authOption";
import { Chapter } from "@/model/chapter.model";
import Ebook from "@/model/book.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest, {params}:{params:Promise<{id:string}>}){

    const {id} = await params;



    await connectDB();

    const [book, session] = await Promise.all([
        Ebook.findById(id).populate("author", "username"),
        getServerSession(authOptions),
    ]);

    const isOwner = session?.user?.id === book?.author?._id?.toString();
    const isPublished = book?.isPublished || ["Published", "published"].includes(book?.status ?? "");
    if (!book || (!isPublished && !isOwner)) {
        return NextResponse.json({message:"Book not found."},{status:404})
    }

    const chapter = await Chapter.find({
        bookId:id
    }).populate("author")
    .sort({ order: 1 });

    return NextResponse.json({message:"Book and Chapter fetched successfully.",book,chapter},{status:200})
}
