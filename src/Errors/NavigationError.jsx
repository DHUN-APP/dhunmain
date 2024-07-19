import React from 'react'
import { useNavigate } from 'react-router-dom';
import { UilExclamationTriangle } from '@iconscout/react-unicons'

const NavigationError = () => {
    const navigate = useNavigate();
  return (
    <div className='h-screen w-full flex items-center justify-center flex-col'>
      <h1 className='text-3xl font-semibold flex items-center gap-3 text-red-600'><UilExclamationTriangle size="35" color="red" />Page not found</h1>
      <button className='border-4 border-slate-300 rounded-md py-1 px-3 text-xl text-slate-300 my-5 font-bold' onClick={()=>{navigate('/home')}}>Goto Home</button>
    </div>
  )
}

export default NavigationError
