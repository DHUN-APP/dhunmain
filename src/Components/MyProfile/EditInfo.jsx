import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TiArrowBack } from "react-icons/ti";

const EditInfo = () => {
const navigate = useNavigate();

  return (
    <div className='flex flex-col p-5'>
      <div className='mb-3 flex'><div onClick={() => navigate('/app/myprofile')}><TiArrowBack size={40} color='white' /></div></div>
      <div className='text-xl text-textcolor w-full flex items-center justify-center'>Edit info</div>
    </div>
    
  )
}

export default EditInfo