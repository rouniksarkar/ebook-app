'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const createChapter = () => {

    const [formData,setFormData] = useState({
        title:"",
        content:"",
        bookId:"",
        order:""
    })

    const handleChange= (e:any) =>{
        const {name,value} = e.target;

        setFormData((prev)=>({
            ...prev,
            [name]:value
        }));
    };

    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();

        try {
            const res= await axios.post("/api/chapters/createChapter",formData);
            console.log(res.data);
        } catch (error) {
            console.log("Error at creating a chapter!",error);
            
        }
        
    }
  return (
    <div>
            <h2>Create a new Chapter</h2>
            <form onSubmit={handleSubmit}
                className='flex flex-col gap-4 max-w-md mx-auto mt-10'>
                <input className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2
                 focus:ring-blue-500'
                    type="text" placeholder='Title'
                    value={formData.title} onChange={handleChange} name="title"
                />
                <input className='border border-gray-300 rounded-md py-2 px-4 
                focus:outline-none focus:ring-2 focus:ring-blue-500'
                    type="text" placeholder='Book name'
                    value={formData.bookId} onChange={handleChange} name="bookId"
                />
                
                <textarea className='border border-gray-300 rounded-md py-2 
                px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Content' value={formData.content}
                    onChange={handleChange} name="content"></textarea>

                <input 
                className='border border-gray-300 rounded-md py-2 px-4 
                focus:outline-none focus:ring-2 focus:ring-blue-500'
                type="text" placeholder='Order' 
                value={formData.order} onChange={handleChange} name="order"
                />
                
                <button type='submit' className='bg-blue-500 text-white py-2 
                px-4 rounded-md hover:bg-blue-600 focus:outline-none 
                focus:ring-2 focus:ring-blue-500'>Save This Chapter</button>
            </form>
        </div>
  )
}

export default createChapter