import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        book: 
        {   
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Ebook", 
            required: true, 
            index: true
        },
        user: 
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        content: 
        { 
            type: String, 
            required: true, 
            trim: true, 
            maxlength: 2000 
        },
        parentComment: 
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Comment", 
            default: null 
        },
    },
    { timestamps: true }
);

commentSchema.index({ book: 1, createdAt: -1 });
 
const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
 
export default Comment;