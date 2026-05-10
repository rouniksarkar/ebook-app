import { connectDB } from "@/db/configDb";
import { NextRequest, NextResponse } from "next/server";
import {Chapter} from "@/model/chapter.model";
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOption';

export async function POST(request: NextRequest) {

    const {title, content, order,bookId} = await request.json();

    const session = await getServerSession(authOptions);

    if(!session){
        return NextResponse.json({message:"Unauthorized"},{status:401})
    }

    if(!title || !content || !order){
        return NextResponse.json({message:"All fields are required"}, {status:400})
    }

    await connectDB();

    try {
        const newChapter = await Chapter.create({
            title,
            content,
            order,
            bookId,
            auther:session.user.id,
        })

        return NextResponse.json({message:"Chapter created sucessfully!",newChapter},{status:201})
    } catch (error) {
        return NextResponse.json({message:"Error creating chapter"}, {status:500})
    }
}