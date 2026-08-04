import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ebook",
    }
},{})

likeSchema.index({ book: 1, user: 1 }, { unique: true });
 
const Like = mongoose.models.Like || mongoose.model("Like", likeSchema);
 
export default Like;