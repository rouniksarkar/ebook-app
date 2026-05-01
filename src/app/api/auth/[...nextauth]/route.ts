import { authOptions } from "@/lib/authOption";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions)

export {handler as GET , handler as POST}

//export const { POST, GET } = toNextJsHandler(auth);