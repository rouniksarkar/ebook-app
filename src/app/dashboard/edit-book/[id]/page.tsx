'use client'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import FileUpload from '@/app/componentUpload/FileUpload'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Layers } from 'lucide-react'

const editBook = () => {

    const router = useRouter();

    const { id } = useParams()
    const [formdata, setFormdata] = useState({
        name: "",
        subtitle: "",
        description: "",
        coverImage: "",
        category: "",
        access: ""
    })

    const[progress,setProgress] = useState(0)

    useEffect(() => {
        const fatchUser = async () => {
            try {
                const res = await axios.get(`/api/books/showBook/${id}`)

                setFormdata({
                    name: res.data.book.name || "",
                    subtitle: res.data.book.subtitle || "",
                    description: res.data.book.description || "",
                    category: res.data.book.category || "",
                    coverImage: res.data.book.coverImage || "",
                    access: res.data.book.access || ""
                })
            } catch (error) {
                console.error(error)
            }
        }
        fatchUser()
    }, [id])

    const handleChange = (e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >) => {
        const { name, value } = e.target;

        setFormdata((prev) => ({
            ...prev,
            [name]: value,

        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/books/updateBook/${id}`, formdata);
            console.log(response.data);

            router.push("/dashboard/my-book")

        } catch (error) {
            console.error("Update Error:", error);
        }
    };


    return (
        <div className="flex-1 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-slate-900/60 py-12 px-6">
            <div className="max-w-xl mx-auto bg-white dark:bg-slate-900/80 rounded-3xl border border-card-border p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden flex flex-col gap-6">
                
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full blur-xl pointer-events-none"></div>

                {/* Back Link */}
                <div>
                    <Link 
                        href="/dashboard/my-book"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to My Books</span>
                    </Link>
                </div>

                <div className="text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center justify-center sm:justify-start gap-2">
                        <BookOpen className="w-7 h-7 text-indigo-500" />
                        Edit Book Details
                    </h1>
                    <p className="text-sm text-muted mt-1.5">
                        Modify book details, cover files, and reading privacy preferences.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-col gap-5 border-t border-card-border pt-6'>
                    {/* Title */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">Book Title</label>
                        <input 
                            className="w-full px-4 py-3 rounded-xl border border-card-border bg-slate-50 dark:bg-slate-800/40 text-foreground placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-850/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-semibold"
                            type="text" 
                            placeholder='Title'
                            value={formdata.name} 
                            onChange={handleChange} 
                            name="name"
                            required
                        />
                    </div>

                    {/* Subtitle */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">Subtitle</label>
                        <input 
                            className="w-full px-4 py-3 rounded-xl border border-card-border bg-slate-50 dark:bg-slate-800/40 text-foreground placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-850/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-semibold"
                            type="text" 
                            placeholder='Subtitle'
                            value={formdata.subtitle} 
                            onChange={handleChange} 
                            name="subtitle"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">Description</label>
                        <textarea 
                            className="w-full px-4 py-3 rounded-xl border border-card-border bg-slate-50 dark:bg-slate-800/40 text-foreground placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-850/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-semibold min-h-[100px]"
                            placeholder='Description'
                            value={formdata.description} 
                            onChange={handleChange}
                            name="description"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">Category</label>
                        <input 
                            className="w-full px-4 py-3 rounded-xl border border-card-border bg-slate-50 dark:bg-slate-800/40 text-foreground placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-850/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-semibold"
                            type="text" 
                            placeholder='Category' 
                            value={formdata.category} 
                            onChange={handleChange} 
                            name="category"
                            required
                        />
                    </div>

                    {/* Cover Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">Cover Image</label>
                        <div className="p-5 border-2 border-dashed border-card-border hover:border-indigo-500/50 rounded-2xl bg-slate-50 dark:bg-slate-800/20 transition-all flex flex-col items-center gap-4">
                            <FileUpload
                                fileType="image"
                                onProgress={(progress)=>setProgress(progress)}
                                onSucess={(response)=>{
                                    console.log(response);
                                    setFormdata((prev)=>({
                                        ...prev,
                                        coverImage:response.url
                                    }))
                                }}
                            />
                            
                            {progress > 0 && (
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden max-w-xs mt-2">
                                    <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                </div>
                            )}

                            {formdata.coverImage && (
                                <img
                                    src={formdata.coverImage}
                                    alt="Cover"
                                    className="w-28 rounded-xl border border-card-border shadow-md object-cover aspect-[3/4] mt-2"
                                />
                            )}
                        </div>
                    </div>

                    {/* Access level (paid/free) radio choices */}
                    <div className="flex flex-col gap-2 border-t border-card-border pt-4">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted px-1">Access Tier</label>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-3 p-3.5 border border-card-border hover:border-indigo-500/30 rounded-xl bg-slate-50 dark:bg-slate-800/30 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="access" 
                                    value="Free" 
                                    checked={formdata.access === "Free" || !formdata.access}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-indigo-600 border-card-border focus:ring-indigo-500"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-foreground">Free Access</span>
                                    <span className="text-xs text-muted">Everyone can view and read all chapters for free.</span>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 p-3.5 border border-card-border hover:border-indigo-500/30 rounded-xl bg-slate-50 dark:bg-slate-800/30 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="access" 
                                    value="Paid" 
                                    checked={formdata.access === "Paid"}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-indigo-600 border-card-border focus:ring-indigo-500"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-foreground">Paid Access (Premium Features)</span>
                                    <span className="text-xs text-muted">Restrict access to paying readers only.</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <button 
                        type='submit' 
                        className="w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 transform active:scale-[0.98] mt-4"
                    >
                        Save Metadata Changes
                    </button>
                </form>
            </div>
        </div>
    )
}

export default editBook


