'use client'
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { Sparkles, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const createBook = () => {
    const { data: session, status } = useSession();
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            alert("Please login first");
            router.push("/");
        }
    }, [status, router]);

    const [name,setName] = useState("");
    const [subtitle,setSubtitle] = useState("");
    const [description,setDescription] = useState("");
    const [category,setCategory] = useState("")

    // --- AI generation state ---
    const [instruction, setInstruction] = useState("");
    const [showAiBox, setShowAiBox] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    if (status === "loading") {
        return <div className="p-6 text-center text-sm font-semibold">Loading...</div>;
    }

    if (!session) {
        return null;
    }

    const handleGenerate = async () => {
        if (!instruction.trim()) return;
        setAiLoading(true);
        try {
            const res = await axios.post("/api/ai/generate-book", { instruction });
            const data = res.data;
            setName(data.title || "");
            setSubtitle(data.subtitle || "");
            setDescription(data.description || "");
            setCategory(data.category || "");
        } catch (err) {
            console.error(err);
            alert("AI generation failed, please try again.");
        } finally {
            setAiLoading(false);
            setShowAiBox(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await axios.post("/api/books/createBook",{
            name,
            subtitle,
            description,
            category
        })
        console.log(response.data)

        const bookId = response.data.book._id;
        setName("");
        setSubtitle("");
        setDescription("");
        setCategory("")
        router.push(`/dashboard/chaptersUi/create-chapter/${bookId}`)
    }

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-slate-900/60 py-12 px-6">
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900/80 rounded-3xl border border-card-border p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden flex flex-col gap-6">
            
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-xl pointer-events-none"></div>

            {/* Back to workspace */}
            <div>
                <Link 
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Workspace</span>
                </Link>
            </div>

            <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center justify-center sm:justify-start gap-2">
                    <BookOpen className="w-7 h-7 text-indigo-500" />
                    Create A Book
                </h1>
                <p className="text-sm text-muted mt-1.5">
                    Start publishing a new story. You can write your own metadata or generate it using AI.
                </p>
            </div>

            {/* AI Generation assistant */}
            <div className="bg-purple-50/50 dark:bg-purple-950/15 border border-purple-200/60 dark:border-purple-900/40 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <h2 className="text-sm font-bold text-purple-900 dark:text-purple-200">AI Metadata Writer</h2>
                    </div>
                    <button
                        type='button'
                        onClick={() => setShowAiBox(!showAiBox)}
                        className='text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white shadow-sm transition-all duration-200 cursor-pointer'
                    >
                        {showAiBox ? "Hide Prompt" : "✨ Write with AI"}
                    </button>
                </div>

                {showAiBox && (
                    <div className='flex flex-col gap-3.5 animate-fadeIn'>
                        <textarea
                            className='w-full border border-purple-200 dark:border-purple-900/50 rounded-xl py-3 px-4 bg-white dark:bg-slate-900 text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm'
                            rows={3}
                            placeholder="Describe your book idea, e.g. 'a mystery novel about a detective in 1920s Kolkata'"
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                        />
                        <button
                            type='button'
                            onClick={handleGenerate}
                            disabled={aiLoading || !instruction.trim()}
                            className='w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer'
                        >
                            {aiLoading ? "Generating Details..." : "Generate Details"}
                        </button>
                    </div>
                )}
            </div>

            {/* Main creation form */}
            <form onSubmit={handleSubmit} className='flex flex-col gap-5 border-t border-card-border pt-6'>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">Book Title</label>
                    <input 
                        className='w-full border border-card-border bg-slate-50 dark:bg-slate-800/40 text-foreground placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-850/80 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-semibold' 
                        type="text" 
                        placeholder='Enter book title...' 
                        value={name} 
                        onChange={(e)=> setName(e.target.value)} 
                        required
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">Subtitle</label>
                    <input 
                        className='w-full border border-card-border bg-slate-50 dark:bg-slate-800/40 text-foreground placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-850/80 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-semibold' 
                        type="text" 
                        placeholder='Enter short subtitle...' 
                        value={subtitle} 
                        onChange={(e)=> setSubtitle(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">Description</label>
                    <textarea 
                        className='w-full border border-card-border bg-slate-50 dark:bg-slate-800/40 text-foreground placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-850/80 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-semibold min-h-[100px]' 
                        placeholder='Enter book synopsis/description...' 
                        value={description} 
                        onChange={(e)=> setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">Category</label>
                    <input 
                        className='w-full border border-card-border bg-slate-50 dark:bg-slate-800/40 text-foreground placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-850/80 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-semibold' 
                        type="text" 
                        placeholder="e.g. Mystery, Sci-Fi, Romance..." 
                        value={category} 
                        onChange={(e)=> setCategory(e.target.value)}
                        required
                    />
                </div>

                <button 
                    type='submit' 
                    className='w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 transform active:scale-[0.98] mt-4'
                >
                    Create Book & Proceed
                </button>
            </form>
        </div>
    </div>
  )
}

export default createBook