'use client'
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Heart, BookOpen, User } from "lucide-react";

interface SavedBook {
    _id: string;
    name: string;
    subtitle?: string;
    description?: string;
    coverImage?: string;
    views?: number;
    likesCount?: number;
    author?: { username?: string };
}

export default function SavedBooksSection() {
    const [books, setBooks] = useState<SavedBook[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadSavedBooks = async (pageNum: number) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/profile/saved-books?page=${pageNum}&limit=6`);
            setBooks((prev) => (pageNum === 1 ? res.data.books : [...prev, ...res.data.books]));
            setHasMore(res.data.hasMore);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSavedBooks(1);
    }, []);

    if (loading && books.length === 0) {
        return (
            <div className="py-6 flex items-center justify-center">
                <span className="w-6 h-6 rounded-full border-2 border-indigo-500/20 border-t-indigo-600 animate-spin"></span>
                <span className="ml-2.5 text-sm font-semibold text-muted">Loading saved books...</span>
            </div>
        );
    }

    if (!loading && books.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900/40 rounded-2xl border border-card-border p-6 text-center">
                <p className="text-muted text-sm font-semibold">
                    You haven&apos;t saved any books yet.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Saved Books</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                    <div
                        key={book._id}
                        className="group bg-white dark:bg-slate-900/60 rounded-3xl border border-card-border overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full"
                    >
                        {/* Cover Container */}
                        <div className="aspect-[4/3] w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-card-border">
                            {book.coverImage ? (
                                <img
                                    src={book.coverImage}
                                    alt={book.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-200 to-indigo-100/55 dark:from-slate-850 dark:to-slate-900 text-muted gap-2">
                                    <BookOpen className="w-8 h-8 opacity-45 text-indigo-500" />
                                    <span className="text-xs font-semibold opacity-60">No Cover</span>
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="p-5 flex flex-col flex-1">
                            <h3 className="text-lg font-bold text-foreground leading-snug tracking-tight line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {book.name}
                            </h3>
                            
                            {book.subtitle && (
                                <p className="text-muted italic text-xs mt-1.5 line-clamp-1">
                                    {book.subtitle}
                                </p>
                            )}

                            {/* Author name & metrics */}
                            <div className="mt-4 flex flex-col gap-3.5 border-t border-card-border pt-3.5">
                                <div className="flex items-center justify-between">
                                    {book.author?.username && (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted">
                                            <User className="w-3.5 h-3.5 text-indigo-500" />
                                            {book.author.username}
                                        </span>
                                    )}

                                    <div className="flex items-center gap-3.5 text-xs text-muted font-bold ml-auto">
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-3.5 h-3.5 opacity-70" />
                                            {book.views ?? 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/10" />
                                            {book.likesCount ?? 0}
                                        </span>
                                    </div>
                                </div>

                                <Link href={`/dashboard/chaptersUi/all-chapter/${book._id}`}>
                                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all duration-200">
                                        Open Book
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="text-center mt-8">
                    <button
                        onClick={() => {
                            const next = page + 1;
                            setPage(next);
                            loadSavedBooks(next);
                        }}
                        disabled={loading}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50 inline-flex items-center gap-2"
                    >
                        {loading && <span className="w-3 h-3 rounded-full border border-indigo-600 border-t-transparent animate-spin"></span>}
                        <span>{loading ? "Loading..." : "Load more books"}</span>
                    </button>
                </div>
            )}
        </div>
    );
}