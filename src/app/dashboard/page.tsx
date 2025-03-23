"use client"
import { useUser } from '@/context/UserContext'
import React from 'react'

export default function Dashboard() {
    const {user} = useUser();
  return (
    <div>
      <h1 className='text-2xl'>Hi , {user?.name}</h1>
    </div>
  )
}
