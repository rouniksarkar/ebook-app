'use client'
import React,{useState} from 'react'
import { authClient } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
const signin = () => {
    
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");

    const handleSubmit=async(e:any)=>{
        e.preventDefault();
        const { data, error } = await authClient.signIn.email({
        email: email, // required
        password: password, // required
        rememberMe: true,
        callbackURL: "/dashboard",
    },
    {
        onRequest:(ctx)=>{
            console.log("Loading...");              
        },
        onSuccess:(ctx)=>{
            redirect("/dashboard")
        },
        onError:(ctx)=>{
            console.log("error",ctx);
            
        }
    }
    );
        setEmail("");
        setPassword("");
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

export default signin