import { connectDB } from "@/db/configDb";
import { authOptions } from "@/lib/authOption";
import { Chapter } from "@/model/chapter.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    connectDB();

    const sessions = await getServerSession();

    if (!sessions) {
        return NextResponse.json({ message: "Unauthorized!" }, { status: 400 })
    }

    try {
        const chapter = await Chapter.findById(id)

        if (!chapter) {
            return NextResponse.json({ message: "Chapter not found." }, { status: 404 })
        }

        return NextResponse.json({ message: "Chapter fetched successfully.", chapter }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "Chapter found error." }, { status: 500 })
    }
}