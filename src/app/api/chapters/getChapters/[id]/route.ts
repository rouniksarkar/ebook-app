import { connectDB } from "@/db/configDb";
import { authOptions } from "@/lib/authOption";
import { Chapter } from "@/model/chapter.model";
import Ebook from "@/model/book.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest, {params}:{params:Promise<{id:string}>}){

    const {id} = await params;



    await connectDB();

    const book = await Ebook.findById(id).populate("author","username")

    const chapter = await Chapter.find({
        bookId:id
    }).populate("author")
    .sort({ order: 1 });

    if(chapter.length===0){
        return NextResponse.json({message:"Chapter not found."},{status:404})
    }

    return NextResponse.json({message:"Book and Chapter fetched successfully.",book,chapter},{status:200})
}