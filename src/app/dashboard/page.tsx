import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const Dashboard = async() => {

    const session= await auth.api.getSession({
        headers: await headers()
    })

    if(!session){
        redirect('/signin')
    }
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard