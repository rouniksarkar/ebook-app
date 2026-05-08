import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  console.log("PRIVATE KEY:", process.env.IMAGEKIT_PRIVATE_KEY)
  console.log("PUBLIC KEY:", process.env.IMAGEKIT_PUBLIC_KEY)
  try {
    const uploadComponents = getUploadAuthParams({
      
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    });
  
    return Response.json({
      uploadComponents,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    console.log("Imagekit upload error",error);
    return Response.json({ message: "Failed to get upload auth params" }, { status: 500 });
    
  }
}