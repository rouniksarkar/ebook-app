import { redirect } from 'next/navigation'
import React from 'react'
import { getServerSession } from 'next-auth';
import LogoutBtn from '@/components/LogoutBtn';

const Dashboard = async() => {

    const session= await getServerSession()


    if(!session){
        redirect('/login')
    }
  return (
    <div>
      Dashboard
      <LogoutBtn/>
    </div>
  )
}

export default Dashboard