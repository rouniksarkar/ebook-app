'use client'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Layers } from 'lucide-react'
import TipTapEditor from '@/components/TipTapEditor'

const updateChapter = () => {

  const { id } = useParams()

  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    order: ""
  })

  const [bookId, setBookId] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/chapters/singleChapter/${id}`)
        console.log(res.data);
        setBookId(res.data.chapter.bookId || "")
        
        setFormData({
          title: res.data.chapter.title || "",
          content: res.data.chapter.content || "",
          order: res.data.chapter.order || ""
        })
      } catch (error) {
        console.log(error);
        
      }
    }
    fetchData()
  }, [id])

    const handleChange = (e: any) => {
      const {name,value} = e.target;

      setFormData((prev) => ({
            ...prev,
            [name]: value,

        }));       
    }

    const handleSubmit = async (e:any) => {
      e.preventDefault();

      try {
        const res = await axios.put(`/api/chapters/updateChapter/${id}`,formData)
        console.log(res.data);
        router.push(`/dashboard/chaptersUi/all-chapter/${res.data.updateChapter.bookId}`)
      } catch (error) {
        console.log(error);
      }
      
    }

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-slate-900/60 py-12 px-6">
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900/80 rounded-3xl border border-card-border p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden flex flex-col gap-6">
            
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full blur-xl pointer-events-none"></div>

            {/* Back button */}
            <div>
                <button
                    onClick={() => bookId ? router.push(`/dashboard/chaptersUi/all-chapter/${bookId}`) : router.back()}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-foreground transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Chapters</span>
                </button>
            </div>

            <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center justify-center sm:justify-start gap-2">
                    <Layers className="w-7 h-7 text-indigo-500" />
                    Edit Chapter
                </h1>
                <p className="text-sm text-muted mt-1.5">
                    Update the title, sequence order, or text content of this chapter.
                </p>
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-5 border-t border-card-border pt-6'>
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">Chapter Title</label>
                    <input 
                        className="w-full px-4 py-3 rounded-xl border border-card-border bg-slate-50 dark:bg-slate-800/40 text-foreground placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-850/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-semibold"
                        type="text" 
                        placeholder='Chapter Title'
                        value={formData.title} 
                        onChange={handleChange} 
                        name="title"
                        required
                    />
                </div>
                
                {/* Content */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">Content</label>
                    <div className="rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                        <TipTapEditor
                            content={formData.content}
                            onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                            placeholder="Write your chapter content here..."
                        />
                    </div>
                </div>

                {/* Display Order */}
                <div className="flex flex-col gap-1.5 max-w-[200px]">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">Display Order</label>
                    <input 
                        className="w-full border border-card-border bg-slate-50 dark:bg-slate-800/40 text-foreground placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-850/80 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-semibold"
                        type="text" 
                        placeholder='Order' 
                        value={formData.order} 
                        onChange={handleChange} 
                        name="order"
                        required
                    />
                </div>
                
                <button 
                    type='submit' 
                    className="w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 transform active:scale-[0.98] mt-4"
                >
                    Save Chapter Changes
                </button>
            </form>
        </div>
    </div>
  )
}

export default updateChapter