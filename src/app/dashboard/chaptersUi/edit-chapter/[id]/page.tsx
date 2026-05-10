'use client'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const updateChapter = () => {

  const { id } = useParams()

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    order: ""
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/chapters/getChapters/${id}`)
        console.log(res.data);
        
  
        setFormData({
          title: res.data.chapter.title || "",
          content: res.data.chapter.content || "",
          order: res.data.chapter.order || ""
        })
      } catch (error) {
        console.log(error);
        
      }
    }
    fetchData()
  }, [id])

    const handleChange = (e: any) => {
      const {name,value} = e.target;

      setFormData((prev) => ({
            ...prev,
            [name]: value,

        }));       
    }

    const handleSubmit = async (e:any) => {
      e.preventDefault();

      try {
        const res = await axios.put(`/api/chapters/updateChapter/${id}`,formData)
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
      
    }

  return (
    <div>
        <h2>Update Chapter</h2>
            <form onSubmit={handleSubmit}
                className='flex flex-col gap-4 max-w-md mx-auto mt-10'>
                <input className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2
                 focus:ring-blue-500'
                    type="text" placeholder='Title'
                    value={formData.title} onChange={handleChange} name="title"
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
                focus:ring-2 focus:ring-blue-500'>Edit Chapter</button>
            </form>
    </div>
  )
}

export default updateChapter