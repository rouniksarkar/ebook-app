'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const allChapter = () => {

    const [chapter,setChapter] = useState([]);

    useEffect(()=>{
        const fatchData=async()=>{
            const res = await axios.get("/api/chapters/getChapters")
            setChapter(res.data.chapters);
        }
        fatchData()
    },[])
  return (
    <div>
        <h2>All Chapter</h2>
        <ul>
            {chapter.map((chapter:any)=>(
                <li key={chapter._id}>
                    <p>{chapter.title}</p>
                    <p>{chapter.content}</p>
                    <p>{chapter.order}</p>
                    <p>{chapter.auther}</p>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default allChapter