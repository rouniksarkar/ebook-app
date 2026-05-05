'use client'
import {useState,useEffect} from 'react'
import axios from 'axios'
const myBooks = () => {

    const [books,setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const res = await axios.get("/api/books/showBook");
            setBooks(res.data.books);
        };
        fetchBooks();
    }, []);

  return (
    <div>
        <h1>All Books</h1>
        <ul>
            {books.map((books:any)=>(
                <li key={books._id}>
                    <p>{books.title}</p>
                    <p>{books.subtitle}</p>
                    <p>{books.description}</p>  
                    <p>{books.content}</p>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default myBooks