'use client'
import React,{useState} from 'react'
import { redirect,useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
const login = () => {
    
    const router= useRouter()
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");

    const handleSubmit=async(e:any)=>{
        e.preventDefault();
        await signIn("credentials",{
            email,
            password,
            callbackUrl: "/dashboard"
        })

    }

  return (
    <div className='flex items-center justify-center h-screen'>
        <form className='flex flex-col gap-4 bg-zinc-800 p-4 mx-auto'
            onSubmit={handleSubmit}>
            <input type="text" 
            value={email} 
            onChange={(e)=>setEmail(e.target.value)} 
            placeholder="email"/>

            <input type="password" 
            value={password} 
            onChange={(e)=>setPassword(e.target.value)} 
            placeholder="password"/>

            <button type='submit'>Submit</button>
        </form>
    </div>
  )
}

export default login