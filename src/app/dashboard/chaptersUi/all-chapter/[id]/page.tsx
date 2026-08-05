// 'use client'
// import axios from 'axios';
// import { useParams } from 'next/navigation'
// import React, { useEffect, useState } from 'react'
// import Link from 'next/link';
// import { useSession } from 'next-auth/react';

// const Chapters = () => {

//     const {id}= useParams();

//     const {data:session} = useSession()

//     const [book, setBook] = useState<any>(null);
//     const [chapter,setChapter] = useState([])

//     useEffect(()=>{
//         const fetchData = async ()=>{
//             const res = await axios.get(`/api/chapters/getChapters/${id}`)
//             setBook(res.data.book)
//             setChapter(res.data.chapter);
//             console.log(res.data.chapter);         
//         }
//         fetchData()
//     },[id])

//     const isOwner = session?.user?.id === book?.author?._id;

//   return (
//     <div>
//         <h2>Your Chapters</h2>
//             <ul>
//                 {chapter?.map((item:any)=>(
//                     <li key={item._id} className="mb-4">
//                         <p>{item.title}</p>
//                         <p>{item.content}</p>
//                         <p>{item.order}</p>
//                         <p>{item.bookId?.name}</p>
//                         <p>{item.author?.username}</p>


//                         {isOwner && (
//                             <div className="flex gap-3 mt-2">
//                             <Link
//                                 href={`/dashboard/chaptersUi/edit-chapter/${item._id}`}
//                                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//                             >
//                                 Edit
//                             </Link>

//                             <Link
//                                 href={`/dashboard/chaptersUi/delete-chapter/${item._id}`}
//                                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
//                             >
//                                 Delete
//                             </Link>
//                         </div>
//                         )}
                        
//                     </li>
//                 ))}
//             </ul>

//             {isOwner && (
//                 <div className="flex gap-3 mt-6">
//                 {/* Book-level action, not chapter-level */}
//                 <Link
//                     href={`/dashboard/edit-book/${id}`}
//                     className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
//                 >
//                     Continue and Proceed
//                 </Link>
//             </div>
//             )}
            
//     </div>
//   )
// }

// export default Chapters

'use client'
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ViewTracker from '@/components/Viewtracker ';
import LikeButton from '@/components/Likebutton';
import SaveButton from '@/components/Savebutton';
import CommentSection from '@/components/Commentsection';
import { ArrowLeft, BookOpen, Clock, Edit3, Trash2, Plus, Sparkles, User, Settings, ArrowUpRight } from 'lucide-react';

const Chapters = () => {

    const {id}= useParams();
    const router = useRouter()

    const {data:session} = useSession()

    const [book, setBook] = useState<any>(null);
    const [chapter,setChapter] = useState([])

    useEffect(()=>{
        const fetchData = async ()=>{
            const res = await axios.get(`/api/chapters/getChapters/${id}`)
            setBook(res.data.book)
            setChapter(res.data.chapter);
            console.log(res.data.chapter);         
        }
        fetchData()
    },[id])

    const isOwner = session?.user?.id === book?.author?._id;

    const bookId = Array.isArray(id) ? id[0] : id;

  return (
    <div className="flex-1 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pb-20">
        {bookId && <ViewTracker bookId={bookId} />}

        {/* Hero Showcase Header */}
        <header className="relative bg-slate-900 text-white py-16 px-6 mb-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.2),transparent_45%)]"></div>
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="mb-6">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Library</span>
                    </Link>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                    {book?.category && (
                        <span className="bg-indigo-500/10 text-indigo-300 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 border border-indigo-500/20 rounded-md">
                            {book.category}
                        </span>
                    )}
                    {book?.access?.toLowerCase() === "paid" && (
                        <span className="bg-amber-500/10 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 border border-amber-500/20 rounded-md">
                            Premium
                        </span>
                    )}
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                    {book?.name || "Loading Book..."}
                </h1>

                {book?.subtitle && (
                    <p className="text-slate-400 italic text-sm sm:text-base mt-2.5 max-w-2xl">
                        {book.subtitle}
                    </p>
                )}

                <div className="mt-8 border-t border-slate-800 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-semibold">
                    <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                        By {book?.author?.username || "Unknown Author"}
                    </span>
                    
                    {isOwner && (
                        <div className="flex gap-2">
                            <Link 
                                href={`/dashboard/chaptersUi/create-chapter/${id}`}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all duration-200"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add Chapter
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>

        {/* Reader Core Container */}
        <main className="max-w-4xl mx-auto px-6">
            
            {/* Book Description overview */}
            {book?.description && (
                <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-3xl border border-card-border mb-12 shadow-sm">
                    <h2 className="text-xs font-black uppercase tracking-wider text-muted mb-2">Book Synopsis</h2>
                    <p className="text-sm text-slate-700 dark:text-slate-350 leading-relaxed font-medium">
                        {book.description}
                    </p>
                </div>
            )}

            {/* Chapters layout */}
            <div className="space-y-16">
                {chapter?.map((item:any, index: number)=>(
                    <article 
                        key={item._id} 
                        className="bg-white dark:bg-slate-900/40 p-8 rounded-3xl border border-card-border shadow-sm relative overflow-hidden"
                    >
                        {/* Chapter Number Badge */}
                        <div className="absolute top-8 right-8 text-xs font-black text-indigo-600/10 dark:text-indigo-400/10 text-5xl select-none">
                            #{item.order || index + 1}
                        </div>

                        <div className="border-b border-card-border pb-4 mb-6">
                            <h2 className="text-2xl font-extrabold text-foreground leading-snug tracking-tight">
                                {item.title}
                            </h2>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-muted uppercase mt-1">
                                <span>Chapter Sequence: {item.order}</span>
                            </div>
                        </div>

                        {/* Immersive font rendering block */}
                        <div 
                            className="prose dark:prose-invert prose-indigo font-serif text-lg leading-relaxed text-slate-800 dark:text-slate-300 max-w-none break-words"
                            dangerouslySetInnerHTML={{ __html: item.content }}
                        />

                        {/* Author Chapter Controls */}
                        {isOwner && (
                            <div className="flex items-center gap-2 mt-8 pt-4 border-t border-card-border justify-end">
                                <Link
                                    href={`/dashboard/chaptersUi/edit-chapter/${item._id}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-all"
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                </Link>

                                <Link
                                    href={`/dashboard/chaptersUi/delete-chapter/${item._id}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white dark:text-rose-400 text-xs font-bold rounded-xl transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                </Link>
                            </div>
                        )}
                    </article>
                ))}

                {chapter.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900/60 rounded-3xl border border-card-border text-center shadow-sm">
                        <BookOpen className="w-12 h-12 text-slate-400 mb-3" />
                        <h3 className="text-lg font-bold text-foreground">No Chapters Written Yet</h3>
                        <p className="text-muted text-sm mt-1 max-w-sm">
                            {isOwner ? "Start drafting the chapters for this book using the action panel at the top." : "The author hasn't published any chapters for this book yet. Check back later!"}
                        </p>
                    </div>
                )}
            </div>

            {/* Publish Section for Owner */}
            {isOwner && (
                <div className="flex items-center justify-center gap-4 mt-16 border-t border-card-border pt-8">
                    <Link 
                        href={`/dashboard/edit-book/${id}`}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all duration-200 shadow-md shadow-indigo-500/10 hover:shadow-lg"
                    >
                        Publish
                    </Link>
                </div>
            )}

            {/* Like / Bookmark Action Section */}
            {bookId && (
                <div className="flex items-center justify-center gap-4 mt-16 border-t border-card-border pt-8">
                    <LikeButton bookId={bookId} initialLikesCount={book?.likesCount ?? 0} />
                    <SaveButton bookId={bookId} />
                </div>
            )}

            {/* Comment Section Panel */}
            {bookId && <CommentSection bookId={bookId} />}
        </main>
    </div>
  )
}

export default Chapters
