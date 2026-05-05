import { NextRequest,NextResponse } from "next/server";
import { connectDB } from "@/db/configDb";
import Ebook from "@/model/book.model";


export async function GET(request:NextRequest){
    await connectDB();

    const books = await Ebook.find()

    return NextResponse.json({message:"Books fetched successfully.",books},{status:200})

}