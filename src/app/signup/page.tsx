'use client'
import React, { useState } from 'react'
import { authClient } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
const signup = () => {

    const[name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");

    const handleSubmit=async(e:any)=>{
        e.preventDefault();

        const { data, error } = await authClient.signUp.email({
            name: name, 
            email: email, 
            password: password, 
            callbackURL: '/signin',
        },
        {
            onRequest:(ctx)=>{
                console.log("Loading...");              
            },
            onSuccess:(ctx)=>{
                redirect("/signin")
            },
            onError:(ctx)=>{
                console.log("error",ctx);
            }
        }
    );
    console.log(data);
    
    }

  return (
    <div className='flex items-center justify-center h-screen'>
        <form className='flex flex-col gap-4 bg-zinc-800 p-4 mx-auto '
            onSubmit={handleSubmit}>
            <input className="border-blue-900" type="text" 
            value={name} 
            onChange={(e)=>setName(e.target.value)} 
            placeholder="Name"/>

            <input 
            className="border-blue-900"
            type="text" 
            value={email} 
            onChange={(e)=>setEmail(e.target.value)} 
            placeholder="email"/>

            <input 
            className="border-blue-900"
            type="password" 
            value={password} 
            onChange={(e)=>setPassword(e.target.value)} 
            placeholder="password"/>

            <button type='submit'>Submit</button>
        </form>
    </div>
  )
}

export default signup