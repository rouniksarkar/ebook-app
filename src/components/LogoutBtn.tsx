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
    <div>
        <button onClick={logoutUser}>logout</button>
    </div>
  )
}

export default LogoutBtn