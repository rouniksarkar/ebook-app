'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { BookOpen, Plus, Edit2, Eye } from 'lucide-react'

const myBooks = () => {

    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const res = await axios.get("/api/books/showBook");
            setBooks(res.data.books);
        };
        fetchBooks();
    }, []);

    return (
        <div className="flex-1 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-slate-900/60 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 border-b border-card-border pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            My Publications
                        </h1>
                        <p className="text-sm text-muted mt-2">
                            Manage and edit your self-published works, drafts, and catalog configurations.
                        </p>
                    </div>
                    <div>
                        <Link 
                            href="/dashboard/create-book"
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Book</span>
                        </Link>
                    </div>
                </div>

                {/* Grid Lists */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {books.map((book: any) => (
                        <div
                            key={book._id}
                            className="group bg-white dark:bg-slate-900/60 rounded-3xl border border-card-border overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
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
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-200 to-indigo-100/55 dark:from-slate-800 dark:to-slate-850 text-muted gap-2">
                                        <BookOpen className="w-8 h-8 opacity-40 text-indigo-500" />
                                        <span className="text-xs font-semibold opacity-60">No Cover Uploaded</span>
                                    </div>
                                )}
                                
                                {book.category && (
                                    <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-white/10">
                                        {book.category}
                                    </span>
                                )}
                            </div>

                            {/* Details Body */}
                            <div className="p-6 flex flex-col flex-1">
                                <h2 className="text-xl font-bold text-foreground leading-snug tracking-tight line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {book.name}
                                </h2>

                                {book.subtitle && (
                                    <p className="text-muted italic text-xs mt-1.5 line-clamp-1">
                                        {book.subtitle}
                                    </p>
                                )}

                                <p className="text-slate-600 dark:text-slate-400 text-sm mt-3 line-clamp-3 leading-relaxed flex-1">
                                    {book.description || "No description provided."}
                                </p>

                                <div className="mt-6 border-t border-card-border pt-4 flex gap-3">
                                    <Link 
                                        href={`/dashboard/chaptersUi/all-chapter/${book._id}`}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-all duration-200"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>Chapters</span>
                                    </Link>

                                    <Link 
                                        href={`/dashboard/edit-book/${book._id}`}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-200"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                        <span>Edit Metadata</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {books.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900/60 rounded-3xl border border-card-border text-center shadow-sm">
                        <BookOpen className="w-12 h-12 text-slate-400 mb-3" />
                        <h3 className="text-lg font-bold text-foreground">No Books Created</h3>
                        <p className="text-muted text-sm mt-1 max-w-sm">
                            Get started by writing and publishing your very first digital book now!
                        </p>
                        <Link 
                            href="/dashboard/create-book"
                            className="mt-6 inline-flex items-center gap-1 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                        >
                            Create Your Book
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default myBooks