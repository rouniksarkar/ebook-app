'use client'
import { signOut } from 'next-auth/react'
import React from 'react'

const LogoutBtn = () => {

    const logoutUser =  async()=>{
        await signOut({
            callbackUrl:"/login"
        })
    }

  return (
    <button 
      onClick={logoutUser}
      className="text-sm font-semibold px-4 py-2 rounded-xl text-rose-500 hover:text-white hover:bg-rose-500 border border-rose-500/30 hover:border-transparent transition-all duration-200"
    >
      Logout
    </button>
  )
}

export default LogoutBtn