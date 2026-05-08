'use client'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import FileUpload from '@/app/componentUpload/FileUpload'

const editBook = () => {

    const router = useRouter();

    const { id } = useParams()
    const [formdata, setFormdata] = useState({
        title: "",
        subtitle: "",
        description: "",
        content: "",
        coverImage: "",
        category: "",
        access: ""
    })

    const[progress,setProgress] = useState(0)

    useEffect(() => {
        const fatchUser = async () => {
            try {
                const res = await axios.get(`/api/books/showBook/${id}`)

                setFormdata({
                    title: res.data.book.title || "",
                    subtitle: res.data.book.subtitle || "",
                    description: res.data.book.description || "",
                    content: res.data.book.content || "",
                    coverImage: res.data.book.coverImage || "",
                    category: res.data.book.category || "",
                    access: res.data.book.access || ""
                })
            } catch (error) {
                console.error(error)
            }
        }
        fatchUser()
    }, [id])

    const handleChange = (e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >) => {
        const { name, value } = e.target;

        setFormdata((prev) => ({
            ...prev,
            [name]: value,

        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/books/updateBook/${id}`, formdata);
            console.log(response.data);

            router.push("/dashboard/my-book")

        } catch (error) {
            console.error("Update Error:", error);
        }
    };


    return (
        <div>
            <h2>Edit Page</h2>
            <form onSubmit={handleSubmit}
                className='flex flex-col gap-4 max-w-md mx-auto mt-10'>
                <input className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2
                 focus:ring-blue-500'
                    type="text" placeholder='Title'
                    value={formdata.title} onChange={handleChange} name="title"
                />
                <input className='border border-gray-300 rounded-md py-2 px-4 
                focus:outline-none focus:ring-2 focus:ring-blue-500'
                    type="text" placeholder='Subtitle'
                    value={formdata.subtitle} onChange={handleChange} name="subtitle"
                />
                <textarea className='border border-gray-300 rounded-md py-2 px-4 
                focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Description'
                    value={formdata.description} onChange={handleChange}
                    name="description"></textarea>
                <textarea className='border border-gray-300 rounded-md py-2 
                px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Content' value={formdata.content}
                    onChange={handleChange} name="content"></textarea>

                <input 
                className='border border-gray-300 rounded-md py-2 px-4 
                focus:outline-none focus:ring-2 focus:ring-blue-500'
                type="text" placeholder='Category' 
                value={formdata.category} onChange={handleChange} name="category"
                />
                <FileUpload
                    fileType="image"
                    onProgress={(progress)=>setProgress(progress)}
                    onSucess={(response)=>{
                        console.log(response);
                        
                        setFormdata((prev)=>({
                            ...prev,
                            coverImage:response.url
                        }))
                    }}
                />
                {progress > 0 && (
                    <p>Upload Progress: {progress}%</p>
                )}

                {formdata.coverImage && (
                    <img
                        src={formdata.coverImage}
                        alt="Cover"
                        className="w-40 rounded"
                    />
                )}
                <p>Choose your access level:</p>
                <input type="radio" name="access_type" value="free"/>
                <label >Free Access</label><br/>

                <input type="radio" id="paid_access" name="access_type" value="paid"/>
                <label >Paid Access (Premium Features)</label>
                <button type='submit' className='bg-blue-500 text-white py-2 
                px-4 rounded-md hover:bg-blue-600 focus:outline-none 
                focus:ring-2 focus:ring-blue-500'>Edit Book</button>
            </form>
        </div>
    )
}

export default editBook

