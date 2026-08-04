'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { BookOpen, User } from 'lucide-react'

const BookList = () => {

    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const res = await axios.get("/api/books/authorBook");
            setBooks(res.data.books);
        };
        fetchBooks();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold text-foreground mb-4">My Written Books</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book: any) => (
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
                            
                            {book.category && (
                                <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-white/10">
                                    {book.category}
                                </span>
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

                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-3 line-clamp-2 leading-relaxed flex-1">
                                {book.description || "No description provided."}
                            </p>

                            <div className="mt-5 border-t border-card-border pt-4 flex items-center justify-between gap-3">
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted">
                                    <User className="w-3.5 h-3.5 text-indigo-500" />
                                    {book.author?.username || "Unknown"}
                                </span>

                                <Link href={`/dashboard/chaptersUi/all-chapter/${book._id}`}>
                                    <button className="px-4.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-200">
                                        View
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {books.length === 0 && (
                <p className="text-sm font-semibold text-muted py-6">You haven't written any books yet.</p>
            )}
        </div>
    )
}

export default BookList