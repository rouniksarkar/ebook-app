"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

interface CommentUser {
    _id: string;
    username: string;
    email?: string;
    avatar?: string;
}

interface CommentType {
    _id: string;
    content: string;
    user: CommentUser;
    createdAt: string;
}

export default function CommentSection({ bookId }: { bookId: string }) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<CommentType[]>([]);
    const [total, setTotal] = useState(0);
    const [content, setContent] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const loadComments = async (pageNum: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/books/${bookId}/comments?page=${pageNum}&limit=10`);
            const data = await res.json();
            setComments((prev) => (pageNum === 1 ? data.comments : [...prev, ...data.comments]));
            setTotal(data.total ?? 0);
            setHasMore(!!data.hasMore);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComments(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            alert("Please login first");
            return;
        }
        if (!content.trim() || submitting) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/books/${bookId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => [data.comment, ...prev]);
                setTotal((t) => t + 1);
                setContent("");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        const res = await fetch(`/api/books/${bookId}/comments/${commentId}`, { method: "DELETE" });
        if (res.ok) {
            setComments((prev) => prev.filter((c) => c._id !== commentId));
            setTotal((t) => Math.max(0, t - 1));
        }
    };

    return (
        <div className="mt-12 bg-white dark:bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-card-border shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span>Comments</span>
                <span className="px-2.5 py-1 text-xs font-black bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-full">
                    {total}
                </span>
            </h3>

            <form onSubmit={handleSubmit} className="mb-8">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your thoughts about this chapter..."
                    onClick={() => {
                        if (!session) {
                            alert("Please login first");
                        }
                    }}
                    maxLength={2000}
                    className="w-full border border-card-border bg-slate-50 dark:bg-slate-800/40 text-foreground placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-850/80 rounded-2xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                    rows={3}
                />
                <div className="flex justify-end mt-3">
                    <button
                        type="submit"
                        disabled={submitting || (!!session && !content.trim())}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 transition-all duration-200 transform active:scale-95 cursor-pointer"
                    >
                        {submitting ? "Posting..." : "Post Comment"}
                    </button>
                </div>
            </form>

            <div className="space-y-6">
                {comments?.map((comment) => (
                    <div key={comment._id} className="flex gap-4 border-b border-card-border/50 pb-6 last:border-0 last:pb-0">
                        {/* User Avatar */}
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-indigo-500/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {comment.user?.avatar ? (
                                <img
                                    src={comment.user.avatar}
                                    alt={comment.user.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-indigo-500 font-extrabold text-xs">
                                    {(comment.user?.username || "U").substring(0, 1).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Comment Body */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between gap-4">
                                <span className="font-bold text-sm text-foreground">
                                    {comment.user?.username ?? comment.user?.email ?? "Unknown"}
                                </span>
                                <span className="text-xs text-muted font-medium">
                                    {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            
                            <div className="mt-2 text-sm text-slate-700 dark:text-slate-350 leading-relaxed bg-slate-50 dark:bg-slate-850/60 p-3.5 rounded-2xl border border-card-border/80">
                                {comment.content}
                            </div>

                            {session?.user?.id === comment.user?._id && (
                                <div className="flex justify-end mt-1.5">
                                    <button
                                        onClick={() => handleDelete(comment._id)}
                                        className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {!loading && comments.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-sm text-muted font-medium">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>

            {hasMore && (
                <div className="text-center mt-6">
                    <button
                        onClick={() => {
                            const next = page + 1;
                            setPage(next);
                            loadComments(next);
                        }}
                        disabled={loading}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50"
                    >
                        {loading ? "Loading comments..." : "Load more comments"}
                    </button>
                </div>
            )}
        </div>
    );
}
