import { connectDB } from "@/db/configDb";
import { authOptions } from "@/lib/authOption";
import { Chapter } from "@/model/chapter.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request:NextRequest, {params}:{params:Promise<{id:string}>}){

    const {id} = await params;

    const session = await getServerSession(authOptions)

    if(!session){
        return NextResponse.json({message:"Unauthorized."},{status:401})
    }

    await connectDB();   
    
    const chapter = await Chapter.findById(id);
    
    if(!chapter){
        return NextResponse.json({message:"Chapter not found."},{status:404})
    }
    
    if(chapter.auther.toString()!=session.user.id){
        return NextResponse.json({message:"You are not authorized to update this book."},{status:403})
    }

    const body = await request.json()

    const updateChapter = await Chapter.findByIdAndUpdate(id,{
        title:body.title,
        content:body.content,
        order:body.order
    },{new:true})

    return NextResponse.json({message:"Chapter Updated successfully.",updateChapter},{status:200})
}