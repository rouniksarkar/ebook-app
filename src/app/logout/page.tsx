import React from 'react'
import { authClient } from "@/lib/auth-client"
import { redirect } from 'next/navigation';

const logout = async() => {
    await authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      redirect("/signin"); // redirect to login page
    },
  },
});
  return (
    <div>logout</div>
  )
}

export default logout