import { NextRequest,NextResponse } from "next/server";
import Ebook from "@/model/book.model";
import { connectDB } from "@/db/configDb";
import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";

export async function POST(request:NextRequest){
    const {name,subtitle,description,category} =await request.json();

    await connectDB();

    const session = await getServerSession(authOptions)

    if(!session){
        return NextResponse.json({message:"Unauthorized."},{status:401})
    }

    if(!name || !description || !category){
        return NextResponse.json({message:"name, decription and content are required."},{status:400})
    }

    const existName = await Ebook.findOne({name})

    if(existName){
        return NextResponse.json({message:"This book name already exist."},{status:400})
    }

    const newBook = await Ebook.create({
        name,
        subtitle,
        description, 
        category,
        author:session.user.id,      
    })

    return NextResponse.json({message:"Book created successfully.",book:newBook},{status:201})
}