'use client'
import { SessionProvider } from "next-auth/react"
import { ImageKitProvider } from "@imagekit/next"


const urlEndPoint = process.env.IMAGEKIT_URL;

export default function Providers({children}:{children:React.ReactNode}){
    return (
    <SessionProvider refetchInterval={5*60}>
        <ImageKitProvider urlEndpoint={urlEndPoint}>
            {children}
        </ImageKitProvider>
    </SessionProvider>
    )
    
}