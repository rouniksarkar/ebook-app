'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { Layers, BookOpen, User, Hash } from 'lucide-react';

const allChapter = () => {

    const [chapter,setChapter] = useState([]);

    useEffect(()=>{
        const fatchData=async()=>{
            const res = await axios.get("/api/chapters/getChapters")
            setChapter(res.data.chapters);
        }
        fatchData()
    },[])
  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-slate-900/60 py-12 px-6">
        <div className="max-w-4xl mx-auto">
            <div className="mb-10 text-center sm:text-left">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center justify-center sm:justify-start gap-2">
                    <Layers className="w-8 h-8 text-indigo-500" />
                    All Chapters Feed
                </h1>
                <p className="text-sm text-muted mt-2">
                    Browse recently published chapters across the platform.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {chapter?.map((item:any)=>(
                    <div 
                        key={item._id}
                        className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-card-border hover:shadow-lg transition-all duration-350 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
                                <BookOpen className="w-3.5 h-3.5" />
                                {item.bookId?.name || "Unknown Book"}
                            </div>
                            
                            <h2 className="text-xl font-bold text-foreground leading-snug line-clamp-1">
                                {item.title}
                            </h2>

                            <div 
                                className="text-sm text-slate-600 dark:text-slate-400 mt-3 line-clamp-3 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: item.content }}
                            />
                        </div>

                        <div className="mt-6 border-t border-card-border pt-4 flex items-center justify-between gap-4">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-muted">
                                <User className="w-3.5 h-3.5 text-indigo-500" />
                                {item.author?.username || "Unknown"}
                            </span>

                            <span className="inline-flex items-center gap-1 text-xs font-bold text-muted bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-card-border">
                                <Hash className="w-3 h-3" />
                                Order: {item.order}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {chapter.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900/60 rounded-3xl border border-card-border text-center shadow-sm">
                    <Layers className="w-12 h-12 text-slate-400 mb-3" />
                    <h3 className="text-lg font-bold text-foreground">No Chapters Found</h3>
                    <p className="text-muted text-sm mt-1 max-w-sm">
                        No chapters have been drafted or published yet.
                    </p>
                </div>
            )}
        </div>
    </div>
  )
}

export default allChapter
