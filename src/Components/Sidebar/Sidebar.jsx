import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoHome } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { MdRecentActors } from "react-icons/md";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className=' h-screen flex flex-col items-center cursor-pointer'>
      <ul className='h-screen text-xl text-white font-semibold w-full flex flex-col justify-between'>
        <li className='bg-slate-800 rounded-lg h-[20%] mt-4 mx-4 flex flex-col justify-evenly items-center pl-6'>
          <div onClick={() => navigate('/app/home')} className='flex items-center gap-3 w-full'><IoHome size={30} />Home</div>
          <div onClick={() => navigate('/app/myprofile')} className='flex items-center gap-3 w-full'><MdAccountCircle size={30} /> My Profile</div>
        </li>
        <li className='h-[70%] bg-slate-800 m-4 rounded-lg pl-6 flex gap-3 py-3'><MdRecentActors size={30} />Recents...</li>
        <li onClick={() => navigate('/app/settings')} className='h-[10%] flex items-center bg-slate-800 rounded-lg mb-4 mx-4 pl-6 gap-3'><IoMdSettings size={30} /> Settings</li>
      </ul>
    </div>
  );
}

export default Sidebar;
