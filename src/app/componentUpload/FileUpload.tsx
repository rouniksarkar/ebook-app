"use client"
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

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
        <div className="w-full">
            <label className="flex flex-col items-center justify-center w-full px-4 py-6 border border-dashed border-card-border rounded-xl cursor-pointer hover:border-indigo-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/25 transition-all duration-200">
                <div className="flex flex-col items-center gap-1.5 text-center">
                    <UploadCloud className="w-8 h-8 text-indigo-500 mb-1" />
                    <p className="text-sm font-bold text-foreground">
                        {uploading ? "Uploading..." : "Click to upload image"}
                    </p>
                    <p className="text-xs text-muted">
                        PNG, JPG or WEBP up to 5MB
                    </p>
                </div>
                <input 
                    type="file" 
                    accept={fileType === "image" ? "image/*" : "image/*"}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                />
            </label>
            {error && (
                <p className="text-xs font-bold text-rose-500 mt-2 text-center">{error}</p>
            )}
        </div>
    );
};

export default FileUpload;