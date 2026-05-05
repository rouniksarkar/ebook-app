import mongoose from "mongoose";

export interface IBook{
    title:string,
    subtitle?:string,
    description:string,
    content:string,
    category?:string,
    author:mongoose.Types.ObjectId,
    isPublished:boolean,
    access:string,
    aiGenerated:boolean,
    coverImage?:string,
    chapter:string[],
}

const bookeSchema=new mongoose.Schema<IBook>({
    title:{
        type:String,
        required:[true,"Title must needed."],
    },
    subtitle:{
        type:String,
        required:[true,"Subtitle must needed."],
    },
    description:{
        type:String,
        required:[true,"Description must needed."],
    },
    content:{
        type:String,
        required:[true,"Content must needed."],
    },
    category:{
        type:String,
        default:""
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true,
    },
    isPublished:{
        type:Boolean,
        default:false
    },
    access:{
        type:String,
        enum:["public","private"],
        default:"public"
    },
    aiGenerated:{
        type:Boolean,
        default:false
    },
    coverImage:{
        type:String,
        default:""
    },
    chapter:{
        type:[String],
        default:[]
    },
},{
    timestamps:true
})

const Ebook= mongoose.models.Ebook || mongoose.model<IBook>("Ebook",bookeSchema)

export default Ebook;