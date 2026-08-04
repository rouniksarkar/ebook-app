"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Bookmark } from "lucide-react";

export default function SaveButton({ bookId }: { bookId: string }) {
    const { data: session, status } = useSession();
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "loading" || !session) return;
        fetch(`/api/books/${bookId}/save`)
            .then((res) => res.json())
            .then((data) => setSaved(!!data.saved))
            .catch(() => {});
    }, [bookId, session, status]);

    const handleSave = async () => {
        if (!session) {
            alert("Please login first");
            return;
        }
        if (loading) return;
        setLoading(true);

        const prevSaved = saved;
        setSaved(!saved); // optimistic

        try {
            const res = await fetch(`/api/books/${bookId}/save`, { method: "POST" });
            const data = await res.json();
            if (res.ok) {
                setSaved(data.saved);
            } else {
                setSaved(prevSaved);
            }
        } catch {
            setSaved(prevSaved);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSave}
            disabled={loading}
            aria-pressed={saved}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-300 transform active:scale-95 ${
                saved
                    ? "bg-indigo-500/10 border-indigo-300 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "bg-white dark:bg-slate-900 border-card-border text-muted hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-800"
            } disabled:opacity-60 cursor-pointer`}
        >
            <Bookmark className={`w-4 h-4 transition-transform duration-300 ${saved ? "fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400 scale-105" : ""}`} />
            <span>{saved ? "Saved" : "Save"}</span>
        </button>
    );
}