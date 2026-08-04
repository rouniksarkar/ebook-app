"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Heart } from "lucide-react";

export default function LikeButton({
    bookId,
    initialLikesCount = 0,
}: {
    bookId: string;
    initialLikesCount?: number;
}) {
    const { data: session, status } = useSession();
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // only need to check "liked" state once auth status resolves
        if (status === "loading") return;
        fetch(`/api/books/${bookId}/like`)
            .then((res) => res.json())
            .then((data) => {
                setLiked(!!data.liked);
                setLikesCount(data.likesCount ?? initialLikesCount);
            })
            .catch(() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookId, status]);

    const handleLike = async () => {
        if (!session) {
            alert("Please login first");
            return;
        }
        if (loading) return;
        setLoading(true);

        const prevLiked = liked;
        const prevCount = likesCount;

        // optimistic update
        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);

        try {
            const res = await fetch(`/api/books/${bookId}/like`, { method: "POST" });
            const data = await res.json();
            if (res.ok) {
                setLiked(data.liked);
                setLikesCount(data.likesCount);
            } else {
                setLiked(prevLiked);
                setLikesCount(prevCount);
            }
        } catch {
            setLiked(prevLiked);
            setLikesCount(prevCount);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={loading}
            aria-pressed={liked}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-300 transform active:scale-95 ${
                liked
                    ? "bg-rose-500/10 border-rose-300 dark:border-rose-900/40 text-rose-600 dark:text-rose-450 shadow-sm"
                    : "bg-white dark:bg-slate-900 border-card-border text-muted hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-800"
            } disabled:opacity-60 cursor-pointer`}
        >
            <Heart className={`w-4 h-4 transition-transform duration-300 ${liked ? "fill-rose-500 text-rose-500 scale-110" : ""}`} />
            <span>{likesCount}</span>
        </button>
    );
}