import React from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const HomePage = () => {
  const { user, logout } = useAuth();
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
    <div className="text-2xl text-white bg-slate-800 font-bold">
      <h1>Welcome to Home</h1>
      {user && (
        <div className="user-info">
          <img src={user.photoURL} alt="User Avatar" className="user-avatar" />
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
      <Link to="/" className="px-4 py-2" onClick={handleLogout}>Logout</Link>
    </div>
  );
};

export default HomePage;
