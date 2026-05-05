'use client'
import axios from 'axios';
import React, { useState } from 'react'

const createBook = () => {

    const [title,setTitle] = useState("");
    const [subtitle,setSubtitle] = useState("");
    const [description,setDescription] = useState("");
    const [content,setContent] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await axios.post("/api/books/createBook",{
            title,
            subtitle,
            description,
            content
        })
        console.log(response.data)
        setTitle("");
        setSubtitle("");
        setDescription("");
        setContent("");
    }
  return (
    <div>
        <form onSubmit={handleSubmit}
            className='flex flex-col gap-4 max-w-md mx-auto mt-10'>
            <input className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500' type="text" placeholder='Title' value={title} onChange={(e)=> setTitle(e.target.value)}/>
            <input className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500' type="text" placeholder='Subtitle' value={subtitle} onChange={(e)=> setSubtitle(e.target.value)}/>
            <textarea className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Description' value={description} onChange={(e)=> setDescription(e.target.value)}></textarea>
            <textarea className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Content' value={content} onChange={(e)=> setContent(e.target.value)}></textarea>
            <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'>Create Book</button>
        </form>

    </div>
  )
}

export default createBook