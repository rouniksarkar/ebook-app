import mongoose from "mongoose";

export interface IView {
    user?: mongoose.Types.ObjectId | null;
    book: mongoose.Types.ObjectId;
    guestId?: string | null;
    viewedAt?: Date;
}

const viewSchema = new mongoose.Schema<IView>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ebook",
        required: true
    },
    guestId: {
        type: String,
        default: null
    },
    viewedAt: {
        type: Date,
        default: Date.now
    }
});

// One counted view per (book, user) — only applies to docs where `user` is
// actually an ObjectId, so it never fires for guest views (where user is null).
viewSchema.index(
    { book: 1, user: 1 },
    { unique: true, partialFilterExpression: { user: { $type: "objectId" } } }
);

// One counted view per (book, guestId) — only applies to docs where
// `guestId` is actually a string, so it never fires for logged-in views.
viewSchema.index(
    { book: 1, guestId: 1 },
    { unique: true, partialFilterExpression: { guestId: { $type: "string" } } }
);

const View = mongoose.models.View || mongoose.model<IView>("View", viewSchema);

export default View;