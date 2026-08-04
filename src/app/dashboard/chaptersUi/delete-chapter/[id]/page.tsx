'use client'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

const DeleteChapter = () => {

    const {id} = useParams()

    const router = useRouter()

    const handleDelateChapter = async () =>{
        const confirmDelete = confirm("Are you sure you want to delete this chapter?");
        if (!confirmDelete) return;

        const res = await axios.delete(`/api/chapters/deleteChapter/${id}`)
        console.log(res.data);
        router.push(`/dashboard/chaptersUi/all-chapter/${res.data.deleteChapter.bookId}`)
        
    }
  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-slate-900/60 py-12 px-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl border border-card-border shadow-xl text-center flex flex-col items-center gap-6">
            <div className="w-14 h-14 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500">
                <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
                <h1 className="text-xl font-extrabold text-foreground">Delete Chapter</h1>
                <p className="text-sm text-muted mt-2">
                    Are you sure you want to delete this chapter? This action is permanent and all text content will be permanently removed.
                </p>
            </div>

            <div className="flex w-full gap-3.5 mt-2">
                <button
                    onClick={() => router.back()}
                    className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={handleDelateChapter}
                    className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                >
                    Delete Chapter
                </button>
            </div>
        </div>
    </div>
  )
}

export default DeleteChapter