import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';


const NavBar = () => {

  const { user, userId, logout } = useAuth();
  const navigate = useNavigate();

    const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  return (
    <div className='p-3 w-full h-16 bg-slate-600 flex items-center justify-around top-0 sticky shadow-black shadow-md'>
        <h1 className='text-2xl text-textcolor font-bold'>Admin Panel</h1>
        <button onClick={() => handleLogout()} className='bg-slate-400 px-5 py-1 text-xl text-slate-800 font-bold rounded-full'>logout</button>
    </div>
  )
}

export default NavBar