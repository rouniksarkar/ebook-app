'use client'
import axios from 'axios';
import React, { useState } from 'react'
import FileUpload from '@/app/componentUpload/FileUpload'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, MessageSquare, Camera } from 'lucide-react';

const ProfileUpadte = () => {

    const [formData, setFormData] = useState({
        fullname: "",
        bio: "",
        avatar: ""
    })

    const [progress, setProgress] = useState(0)

    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await axios.put("/api/profile", formData);
            console.log(res.data);
            router.push("/dashboard/profilePage/profile")

        } catch (error) {
            console.error("Error on updating profile!")
        }
    }

    return (
        <div className="flex-1 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-slate-900/60 py-12 px-6">
            <div className="max-w-xl mx-auto bg-white dark:bg-slate-900/80 rounded-3xl border border-card-border p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden">
                {/* Back button */}
                <div className="mb-6">
                    <Link 
                        href="/dashboard/profilePage/profile"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Profile</span>
                    </Link>
                </div>

                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        Update Profile
                    </h1>
                    <p className="text-sm text-muted mt-1.5">
                        Customize your public author details and appearance.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                    {/* Fullname input */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted px-1 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-indigo-500" />
                            Full Name
                        </label>
                        <input 
                            className="w-full px-4 py-3 rounded-xl border border-card-border bg-slate-50 dark:bg-slate-800/40 text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800/90 transition-all duration-200"
                            type="text" 
                            placeholder="John Doe"
                            value={formData.fullname} 
                            onChange={handleChange} 
                            name="fullname"
                        />
                    </div>

                    {/* Bio input */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted px-1 flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                            Short Bio
                        </label>
                        <input 
                            className="w-full px-4 py-3 rounded-xl border border-card-border bg-slate-50 dark:bg-slate-800/40 text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800/90 transition-all duration-200"
                            type="text" 
                            placeholder="Write a brief intro about yourself..."
                            value={formData.bio} 
                            onChange={handleChange} 
                            name="bio"
                        />
                    </div>

                    {/* Avatar Upload Container */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted px-1 flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-indigo-500" />
                            Profile Picture
                        </label>
                        
                        <div className="p-5 border-2 border-dashed border-card-border hover:border-indigo-500/50 rounded-2xl bg-slate-50 dark:bg-slate-800/20 transition-all flex flex-col items-center gap-4">
                            <FileUpload
                                fileType="image"
                                onProgress={(progress) => setProgress(progress)}
                                onSucess={(response) => {
                                    console.log(response);
                                    setFormData((prev) => ({
                                        ...prev,
                                        avatar: response.url
                                    }))
                                }}
                            />
                            
                            {progress > 0 && (
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden max-w-xs mt-2">
                                    <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                </div>
                            )}

                            {formData.avatar && (
                                <div className="relative group mt-2">
                                    <img
                                        src={formData.avatar}
                                        alt="Avatar Preview"
                                        className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md"
                                    />
                                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-default">
                                        <span className="text-[10px] text-white font-bold uppercase">Uploaded</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 transform active:scale-[0.98] mt-4"
                    >
                        Save Settings
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ProfileUpadte