'use client'
import React, { useState } from 'react'
import { redirect, useRouter } from 'next/navigation'; // Use useRouter for client-side navigation
import axios from 'axios';

const Signup = () => {
    const router = useRouter(); // Initialize router

    const [formdata, setFormdata] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormdata((prev) => ({
            ...prev,          
            [name]: value,  
               
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post("/api/auth/register", formdata);
            console.log(response.data);
            
            router.push("/login")
        } catch (error) {
            console.error("Signup Error:", error);
        }
    };

    return (
        <div className='flex items-center justify-center h-screen'>
            <form className='flex flex-col gap-4 bg-zinc-800 p-4 mx-auto' onSubmit={handleSubmit}>
                {/* Added 'name' attribute to each input */}
                <input 
                    name="username" 
                    className="border-blue-900 text-white p-2" 
                    type="text" 
                    value={formdata.username} 
                    onChange={handleChange} 
                    placeholder="username"
                />

                <input 
                    name="email"
                    className="border-blue-900 text-white p-2"
                    type="email" 
                    value={formdata.email} 
                    onChange={handleChange} 
                    placeholder="Email"
                />

                <input 
                    name="password"
                    className="border-blue-900 text-white p-2"
                    type="password" 
                    value={formdata.password} 
                    onChange={handleChange} 
                    placeholder="Password"
                />

                <button className='bg-blue-600 p-2 rounded' type='submit'>
                    Submit
                </button>
            </form>
        </div>
    )
}

export default Signup;
