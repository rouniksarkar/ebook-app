import mongoose from "mongoose";
 
export interface ISave {
    book: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    createdAt?: Date;
}
 
const saveSchema = new mongoose.Schema<ISave>(
    {
        book: { type: mongoose.Schema.Types.ObjectId, ref: "Ebook", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);
 
// A user can save a book only once
saveSchema.index({ book: 1, user: 1 }, { unique: true });
 
const Save = mongoose.models.Save || mongoose.model<ISave>("Save", saveSchema);
 
export default Save;