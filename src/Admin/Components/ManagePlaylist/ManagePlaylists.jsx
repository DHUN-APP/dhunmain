import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TiArrowBack } from "react-icons/ti";

const ManagePlaylists = () => {
  const navigate = useNavigate();
  return (
    <div className='p-5'>
      <div className='mb-3 flex'><div onClick={() => navigate('/admin/home')}><TiArrowBack size={40} color='white' /></div></div>
      <div className=' text-xl font-bold text-textcolor'>ManagePlaylists</div>
    </div>
    
  )
}

export default ManagePlaylists