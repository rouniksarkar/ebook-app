import { NextRequest,NextResponse } from "next/server";
import { connectDB } from "@/db/configDb";
import EBook from "@/model/book.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

export async function PUT(request:NextRequest,{params}:{params:Promise<{id:string}>}){
    const {id} = await params

    await connectDB()

    const session = await getServerSession(authOptions)

    if(!session){
        return NextResponse.json({message:"Unauthorized."},{status:401})
    }

    const book = await EBook.findById(id);

    if(!book){
        return NextResponse.json({message:"Book not found."},{status:404})
    }

    if(book.author.toString()!==session.user.id){
        return NextResponse.json({message:"You are not authorized to update this book."},{status:403})
    }

    const body = await request.json();


    const normalizedAccess = body.access 
        ? (body.access.charAt(0).toUpperCase() + body.access.slice(1).toLowerCase()) 
        : book.access;

    const updateBook = await EBook.findByIdAndUpdate(id,
        {
            name:body.name ,
            subtitle:body.subtitle || book.subtitle,
            description:body.description || book.description,   
            category:body.category || book.category,
            coverImage:body.coverImage || book.coverImage,
            access:normalizedAccess,
            isPublished:true,
            status:"Published",
            author:session.user.id,
        }
    ,{new:true})

    return NextResponse.json({message:"Book updated successfully.",book:updateBook},{status:200})

}