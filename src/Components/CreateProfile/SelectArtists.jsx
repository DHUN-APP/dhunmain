import React from 'react'
import { Link } from 'react-router-dom'

const SelectArtists = () => {
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
    <h1 className='text-3xl text-textcolor font-bold my-5'>Select Artists</h1>
    <Link to="/createprofile/plan" className='text-2xl text-textcolor font-semibold border-2 border-primarycolor rounded-lg px-5 py-1'>Next</Link>
    </div>  
  )
}

export default SelectArtists