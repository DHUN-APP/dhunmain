
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import { useNavigate, Link } from 'react-router-dom';
import LocalLoader from '../Loders/LocalLoader'


const Home = () => {
  const { user, userId, logout } = useAuth();
  const [firestoreUser, setFirestoreUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getFirestoreData = async () => {
      try {
        const q = query(collection(db, "users"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setFirestoreUser(doc.data());
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) {
      getFirestoreData();
    }
  }, [userId]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading) {
    return <LocalLoader/>;
  }

  if (!user) {
    return (
      <div className='w-full h-svh flex flex-col items-center justify-center' >
        <h1 className='text-3xl text-red-600 font-bold my-10'>"Opps! Access Denied"</h1>
        <button className='text-xl text-white font-semibold border-2 px-5 py-2 rounded-lg' onClick={() => { navigate('/') }}> Goto Login Page</button>
      </div>
    );
  }

  return (
    <div className=' w-full h-screen flex items-center justify-center flex-col '>
    <h1 className='text-textcolor text-3xl font-bold mb-3'>Home</h1>
        {user && (
        <div className="flex flex-col justify-center items-center border-2 rounded-lg p-5 w-[400px]">
          <img src={user.photoURL} alt="User Avatar" height={100} width={100} className='rounded-full' />
          <p className='text-xl text-textcolor font-semibold'>Name: {user.name}</p>
          <p className='text-xl text-textcolor font-semibold'>Email: {user.email}</p>
        </div>
      )}
      <Link to="/" className="p-2 w-[400px] bg-slate-400 mt-5 flex items-center justify-center font-semibold text-xl rounded-lg" onClick={handleLogout}>Logout</Link>
     
    </div>
  );
};

export default Home;
