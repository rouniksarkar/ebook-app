"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileUploadProps{
    onSucess: (res:any) => void
    onProgress?: (progress: number) => void
    fileType?: "image"
}

const FileUpload = ({
    onSucess,
    onProgress,
    fileType
}:FileUploadProps) => {

    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    //optional validation

    const validateFile = (file: File) => {

    if (fileType === "image") {

        if (!file.type.startsWith("image/")) {

            setError("Please Upload a valid Image file")

            return false
        }
    }

    return true
 }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) =>{
        const file = e.target.files?.[0]
        if(!file || !validateFile(file)){
            return;
        }
        setUploading(true)
        setError(null)

        try {
            const authRes = await fetch("/api/upload-auth")

            const auth = await authRes.json()

            const res = await upload({
                file,
                fileName: file.name,
                publicKey: auth.publicKey,
                signature: auth.uploadComponents.signature,
                expire: auth.uploadComponents.expire,
                token: auth.uploadComponents.token,
                onProgress:(event)=>{
                    if(event.lengthComputable && onProgress){
                        const progress = (event.loaded / event.total) * 100
                        onProgress(Math.round(progress))
                    }
                }  
            })

            onSucess(res)

        } catch (error) {
            console.error("Upload Error:", error)
        }finally{
            setUploading(false)
        }

    }

    return (
        <>
            <input type="file" 
            accept={fileType === "image" ? "image/*" : "image/*"}
            onChange={handleFileChange}
            />
            {uploading && <p>Uploading...</p>}
            
        </>
    );
};

export default FileUpload;