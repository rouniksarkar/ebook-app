'use client'
import React,{useState} from 'react'
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

const login = () => {
    
    const router= useRouter()
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");

    const handleSubmit=async(e:any)=>{
        e.preventDefault();
        await signIn("credentials",{
            email,
            password,
            callbackUrl: "/"
        })
    }

  return (
    <div className='min-h-[calc(100vh-73px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-slate-950 dark:to-slate-900/60 p-4'>
        <div className="w-full max-w-md bg-white dark:bg-slate-900/80 p-8 rounded-3xl border border-card-border shadow-xl backdrop-blur-md relative overflow-hidden">
            {/* Top decorative gradient blur */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-full blur-2xl opacity-20 dark:opacity-30"></div>
            
            <div className="text-center mb-8">
                <span className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-black text-xl shadow-lg shadow-indigo-500/20 mb-4">
                    L
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
                    Welcome Back
                </h1>
                <p className="text-sm text-muted mt-2">
                    Log in to continue your reading journey
                </p>
            </div>

            <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted px-1">
                        Email Address
                    </label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e)=>setEmail(e.target.value)} 
                        placeholder="you@example.com"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-card-border bg-slate-50 dark:bg-slate-800/40 text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800/90 transition-all duration-200"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted px-1">
                        Password
                    </label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e)=>setPassword(e.target.value)} 
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-card-border bg-slate-50 dark:bg-slate-800/40 text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800/90 transition-all duration-200"
                    />
                </div>

                <button 
                    type='submit'
                    className="w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 transform active:scale-[0.98] mt-2"
                >
                    Sign In
                </button>
            </form>

            <div className="mt-8 text-center border-t border-card-border pt-6">
                <p className="text-sm text-muted">
                    Don't have an account?{" "}
                    <Link href="/signup" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    </div>
  )
}

export default login