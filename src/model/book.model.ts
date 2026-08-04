import mongoose from "mongoose";

export interface IBook{
    name:string,
    subtitle?:string,
    description:string,
    category?:string,
    author:mongoose.Types.ObjectId,
    isPublished:boolean,
    access:string,
    aiGenerated:boolean,
    coverImage?:string,
    chapter:string[],
    status:string,
    views: number,
    likesCount: number,
    savesCount: number,
    commentsCount: number,
}

const bookeSchema=new mongoose.Schema<IBook>({
    name:{
        type:String,
        required:[true,"Name must needed."],
    },
    subtitle:{
        type:String,
        default:""
    },
    description:{
        type:String,
        required:[true,"Description must needed."],
    },
    category:{
        type:String,
        default:""
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    isPublished:{
        type:Boolean,
        default:false
    },
    access:{
        type:String,
        enum:["Free","Paid"],
        default:"Free"
    },
    aiGenerated:{
        type:Boolean,
        default:false
    },
    coverImage:{
        type:String,
        default:""
    },
    status:{
        type:String,
        enum:["Draft","Published"],
        default:"Draft"
    },
    views: {
        type: Number,
        default: 0,
        index: true, // useful for "trending" / sort by views
    },
    likesCount: {
        type: Number,
        default: 0,
        index: true,
    },
    savesCount: {
        type: Number,
        default: 0,
    },
    commentsCount: {
        type: Number,
        default: 0,
    },
},{
    timestamps:true
})

const Ebook= mongoose.models.Ebook || mongoose.model<IBook>("Ebook",bookeSchema)

export default Ebook;