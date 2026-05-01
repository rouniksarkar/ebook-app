import { connectDB } from "@/db/configDb";
import User from "@/model/user.model";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request:NextRequest){

    const {username,email,password} = await  request.json();

    if(!username || !email || !password){
        return NextResponse.json({message:"All fields are required!"},{status:400})
    }

    await connectDB();

    const existing = await User.findOne({
        $or:[{email},{username}]
    })

    if(existing){
        return NextResponse.json({message:"User allready exists!"},{status:400})
    }

    const user = await User.create({
        username,
        email,
        password
    })

    return NextResponse.json({Message:"Successfully Registered!"},{status:200})
}