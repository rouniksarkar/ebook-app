import { NextRequest,NextResponse } from "next/server";
import Ebook from "@/model/book.model";
import { connectDB } from "@/db/configDb";
import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";

export async function POST(request:NextRequest){
    const {title,subtitle,description,content} =await request.json();

    await connectDB();

    const session = await getServerSession(authOptions)

    if(!session){
        return NextResponse.json({message:"Unauthorized."},{status:401})
    }

    if(!title || !description || !content){
        return NextResponse.json({message:"Title, decription and content are required."},{status:400})
    }

    const existTitle = await Ebook.findOne({title})

    if(existTitle){
        return NextResponse.json({message:"Title already exist."},{status:400})
    }

    const newBook = await Ebook.create({
        title,
        subtitle,
        description,
        content, 
        author:session.user.id,       
    })

    return NextResponse.json({message:"Book created successfully.",book:newBook},{status:201})
}