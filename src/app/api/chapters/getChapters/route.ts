import { NextResponse, NextRequest } from "next/server";
import {connectDB} from "@/db/configDb";
import { Chapter } from "@/model/chapter.model";

export async function GET(request:NextRequest){

    await connectDB();

    try {
        const chapters = await Chapter.find()
        return NextResponse.json({message:"Get all chapters",chapters},{status:200})
    } catch (error) {
        return NextResponse.json({message:"Error fetching chapters"},{status:500})
    }

}