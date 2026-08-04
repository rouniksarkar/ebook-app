'use client'
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import TipTapEditor from '@/components/TipTapEditor';
import { ArrowLeft, Sparkles } from 'lucide-react';

const createChapter = () => {

    const { bookId } = useParams();

    const router = useRouter()

    const [formData,setFormData] = useState({
        title:"",
        content:"",
        order:"1"
    })

    const [savedCount,setSavedCount] = useState(0)

    // --- Book context, fetched once so AI prompts know what book this chapter belongs to ---
    const [bookContext, setBookContext] = useState({
        title: "",
        description: "",
        category: "",
    });

    // useEffect(() => {
    //     const fetchBook = async () => {
    //         try {
    //             // Adjust this path to match your actual "get single book" endpoint
    //             const res = await axios.get(`/api/books/${bookId}`);
    //             const book = res.data.book || res.data;
    //             setBookContext({
    //                 title: book.name || book.title || "",
    //                 description: book.description || "",
    //                 category: book.category || "",
    //             });
    //         } catch (error) {
    //             console.error("Failed to fetch book context for AI", error);
    //         }
    //     };
    //     if (bookId) fetchBook();
    // }, [bookId]);

    // --- AI generation state (separate instruction per field) ---
    const [titleInstruction, setTitleInstruction] = useState("");
    const [showTitleAi, setShowTitleAi] = useState(false);
    const [titleAiLoading, setTitleAiLoading] = useState(false);

    const [contentInstruction, setContentInstruction] = useState("");
    const [showContentAi, setShowContentAi] = useState(false);
    const [contentAiLoading, setContentAiLoading] = useState(false);

    const generateChapterField = async (fieldType: "chapterTitle" | "chapterContent", instruction: string) => {
        const res = await axios.post("/api/ai/generate-chapter", {
            fieldType,
            context: {
                bookTitle: bookContext.title,
                bookDescription: bookContext.description,
                category: bookContext.category,
                chapterTitle: formData.title,
                order: formData.order,
                instruction,
            },
        });
        return res.data.text as string;
    };

    const handleGenerateTitle = async () => {
        if (!titleInstruction.trim()) return;
        setTitleAiLoading(true);
        try {
            const text = await generateChapterField("chapterTitle", titleInstruction);
            setFormData((prev) => ({ ...prev, title: text }));
        } catch (error) {
            console.error(error);
            alert("AI title generation failed, please try again.");
        } finally {
            setTitleAiLoading(false);
            setShowTitleAi(false);
        }
    };

    const handleGenerateContent = async () => {
        if (!contentInstruction.trim()) return;
        setContentAiLoading(true);
        try {
            const text = await generateChapterField("chapterContent", contentInstruction);
            // TipTap content prop accepts HTML; plain text still renders fine as a paragraph
            setFormData((prev) => ({ ...prev, content: text }));
        } catch (error) {
            console.error(error);
            alert("AI content generation failed, please try again.");
        } finally {
            setContentAiLoading(false);
            setShowContentAi(false);
        }
    };

    const handleChange= (e:any) =>{
        const {name,value} = e.target;

        setFormData((prev)=>({
            ...prev,
            [name]:value
        }));
    };

    const handleContentChange = (content: string) => {
        setFormData((prev) => ({
            ...prev,
            content: content
        }));
    };

    const saveChapterData = async () => {
        try {
            const res =  await axios.post(`/api/chapters/createChapter/${bookId}`,formData)
            console.log(res.data);
            setSavedCount((prev)=>prev+1)
            return true
        } catch (error) {
            console.error("Error at creating a chapter!", error);
            alert("Failed to save chapter. Please try again.");
            return false;
        }
    }

    const handleSaveAndAnother = async (e:React.MouseEvent<HTMLButtonElement>) =>{
        e.preventDefault()

        const isSaved = await saveChapterData()

        if(isSaved){
            setFormData((prev)=>({
                ...prev,
                title:"",
                content:"",
                order :String(Number(prev.order)+1 || 1)
            }))
        }
    }

    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();

        const isSaved = await saveChapterData()

        if(isSaved){
            console.log("Chapter save sucessfully!");
            
            router.push(`/dashboard/chaptersUi/all-chapter/${bookId}`)
        }

        
    }
  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-slate-900/60 py-12 px-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900/80 rounded-3xl border border-card-border p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden flex flex-col gap-6">
            
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-xl pointer-events-none"></div>

            {/* Back button */}
            <div>
                <button 
                    onClick={() => router.push(`/dashboard/chaptersUi/all-chapter/${bookId}`)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-foreground transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Chapter List</span>
                </button>
            </div>

            <div className="text-center sm:text-left border-b border-card-border pb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center justify-center sm:justify-start gap-2">
                    Write New Chapter
                </h1>
                {bookContext.title ? (
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                        Drafting for "{bookContext.title}"
                    </p>
                ) : (
                    <p className="text-sm text-muted mt-1">Structure and compose your book content.</p>
                )}

                {savedCount > 0 && (
                    <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1.5 justify-center sm:justify-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>✓ {savedCount} chapter(s) saved successfully in this session!</span>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Title Input & AI Assistant */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">Chapter Title</label>
                    <div className="flex items-center gap-2">
                        <input 
                            className="flex-1 border border-card-border bg-slate-50 dark:bg-slate-800/40 text-foreground placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-850/80 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-semibold"
                            type="text" 
                            placeholder="e.g. Chapter 1: The Encounter"
                            value={formData.title} 
                            onChange={handleChange} 
                            name="title" 
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowTitleAi(!showTitleAi)}
                            className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
                            title="Generate Title with AI"
                        >
                            <Sparkles className="w-5 h-5" />
                        </button>
                    </div>
                    
                    {showTitleAi && (
                        <div className="bg-purple-50/50 dark:bg-purple-950/15 border border-purple-200/60 dark:border-purple-900/40 rounded-xl p-4 flex flex-col gap-3 animate-fadeIn">
                            <input
                                className="w-full border border-purple-200 dark:border-purple-900/50 rounded-xl py-2.5 px-4 bg-white dark:bg-slate-900 text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-semibold"
                                placeholder="Describe details (e.g. 'a tense scene in the rain')"
                                value={titleInstruction}
                                onChange={(e) => setTitleInstruction(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={handleGenerateTitle}
                                disabled={titleAiLoading || !titleInstruction.trim()}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl text-[10px] uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                            >
                                {titleAiLoading ? "Writing title..." : "Generate Title"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Content Area & AI Assistant */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted">Chapter Content</label>
                        <button
                            type="button"
                            onClick={() => setShowContentAi(!showContentAi)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-100 dark:bg-purple-950/40 hover:bg-purple-200 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Content Drafter</span>
                        </button>
                    </div>

                    {showContentAi && (
                        <div className="bg-purple-50/50 dark:bg-purple-950/15 border border-purple-200/60 dark:border-purple-900/40 rounded-xl p-4 flex flex-col gap-3 mb-2 animate-fadeIn">
                            <textarea
                                className="w-full border border-purple-200 dark:border-purple-900/50 rounded-xl py-3 px-4 bg-white dark:bg-slate-900 text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-semibold"
                                rows={3}
                                placeholder="Describe details (e.g. 'write this chapter where the detective interrogates the suspect, keep it tense')"
                                value={contentInstruction}
                                onChange={(e) => setContentInstruction(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={handleGenerateContent}
                                disabled={contentAiLoading || !contentInstruction.trim()}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl text-[10px] uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                            >
                                {contentAiLoading ? "AI is composing..." : "Write Content"}
                            </button>
                        </div>
                    )}

                    <div className="rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                        <TipTapEditor
                            content={formData.content}
                            onChange={handleContentChange}
                            placeholder="Write your chapter content here..."
                        />
                    </div>
                </div>

                {/* Chapter Order */}
                <div className="flex flex-col gap-1.5 max-w-[200px]">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">Display Order</label>
                    <input 
                        className="w-full border border-card-border bg-slate-50 dark:bg-slate-800/40 text-foreground placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-850/80 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-semibold"
                        type="number" 
                        placeholder="1" 
                        value={formData.order} 
                        onChange={handleChange} 
                        name="order" 
                        required
                    />
                </div>
                
                {/* Form Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4 border-t border-card-border pt-6">
                    <button 
                        type="button" 
                        onClick={handleSaveAndAnother}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-250 py-3.5 px-6 rounded-xl font-bold text-sm shadow-sm transition-all duration-200 cursor-pointer text-center"
                    >
                        Save & Add Another
                    </button>

                    <button 
                        type="submit" 
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all duration-200 cursor-pointer text-center"
                    >
                        Save & Finish
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}

export default createChapter