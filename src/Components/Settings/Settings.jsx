import React from 'react'
import { useAuth } from '../../Context/AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
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
    <div className='text-2xl text-textcolor'>
    <Link to="/" className="p-2 md:w-[400px] w-[90%] bg-slate-400 mt-5 flex items-center justify-center font-semibold text-xl rounded-lg" onClick={handleLogout}>Logout</Link>
    </div>
  )
}

export default Settings