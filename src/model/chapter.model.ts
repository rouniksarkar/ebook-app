import mongoose from "mongoose";

export interface IChapter{
    title:string,
    content:string,
    auther:mongoose.Types.ObjectId,
    bookId:mongoose.Types.ObjectId,
    order:number,
}

const chapterSchema = new mongoose.Schema<IChapter>({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true
    },
    auther:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    bookId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ebook",
        required:true
    },
    order:{
        type:Number,
        required:true
    }
})

export const Chapter = mongoose.models.Chapter || mongoose.model<IChapter>("Chapter",chapterSchema)