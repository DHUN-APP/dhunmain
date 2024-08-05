import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TiArrowBack } from "react-icons/ti";

const ManageUsers = () => {
  return (
    <div className='p-5'>
    <div className='mb-3 flex'><div onClick={() => navigate('/admin/home')}><TiArrowBack size={40} color='white' /></div></div>
    <div className=' text-xl font-bold text-textcolor'>ManageUsers</div>
  </div>
  )
}

export default ManageUsers
