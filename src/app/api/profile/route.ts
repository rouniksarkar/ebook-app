import { connectDB } from "@/db/configDb";
import User from "@/model/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOption";

export async function GET(req: NextRequest) {

    await connectDB()

    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ message: "You are not authenticated!" }, { status: 400 })
    }

    const profile = await User.findById(session.user.id).select("-password")

    if (!profile) {
    return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
    );
}

    return NextResponse.json({ message: "Profile has fetched sucessfully", profile }, { status: 201 })
}

export async function PUT(req: NextRequest) {

    await connectDB()

    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ message: "You are not authenticated!" }, { status: 400 })
    }

    const body = await req.json();

    const updateProfile = await User.findByIdAndUpdate(session.user.id, {
        fullname: body.fullname,
        bio: body.bio,
        avatar: body.avatar,
    },
        { new: true, runValidators: true, })
        .select("-password")

    if (!updateProfile) {
        return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({ message: "Profile created sucessfully", updateProfile }, { status: 200 })
}