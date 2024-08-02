import React from 'react'
import { IoPerson } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";


const MyFollowings = () => {
  return (
    <div className='p-5 max-md:p-3 flex flex-col'>

      <div className='flex justify-between max-md:flex-col'>
      <div className='flex items-center gap-5 max-md:gap-2 text-primarycolor max-md:flex-col'>
        <div className='flex items-center justify-center gap-3'><IoPerson size={30} />
        <h1 className=' text-3xl max-md:text-xl font-semibold text-textcolor'>My Followings (5)</h1>
        </div>
        <div className='ml-5 max-md:ml-3 max-md:my-5  flex items-center justify-center  border-primarycolor text-white font-semibold border-b-2'>
          <IoIosSearch size={20} />
          <input type="text" placeholder='Search Artist' className='outline-none bg-slate-800 px-1' />
        </div>
      </div>
      
      </div>

      <div className='flex space-x-3 mt-10 max-md:mt-3 overflow-auto text-xl font-bold'>
        <div className='bg-slate-400 h-24 w-24 p-3  flex items-center justify-center rounded-full'>Artist</div>
        <div className='bg-slate-400 h-24 w-24 p-3  flex items-center justify-center rounded-full'>Artist</div>
        <div className='bg-slate-400 h-24 w-24 p-3  flex items-center justify-center rounded-full'>Artist</div>
        <div className='bg-slate-400 h-24 w-24 p-3  flex items-center justify-center rounded-full'>Artist</div>
        <div className='bg-slate-400 h-24 w-24 p-3  flex items-center justify-center rounded-full'>Artist</div>
      </div>

    </div>
  )
}

export default MyFollowings