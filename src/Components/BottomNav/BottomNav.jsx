import React, {useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import { IoHome } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";


const BottomNav = () => {
  const { user, userId, logout } = useAuth();
  const [firestoreUser, setFirestoreUser] = useState(null);
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
      }
    };
    if (userId) {
      getFirestoreData();
    }
  }, [userId]);
  return (
    <div className='md:hidden fixed bottom-0 w-screen h-16 bg-slate-800 '>
      <ul className='flex h-full items-center justify-around'>
        <li onClick={() => navigate('/app/home')} ><IoHome size={30} color='white'/></li>
        <li onClick={() => navigate('/app/search')}><IoIosSearch size={30} color='white'/></li>
        <li onClick={() => navigate('/app/myprofile')}>
        {user && firestoreUser ? (
            <img src={firestoreUser.photoURL} alt="User Avatar" height={40} width={40} className='rounded-full' />
          ) : (
            <FaUserCircle size={30} color='white' />
          )}
        </li>
        <li onClick={() => navigate('/app/settings')}><IoMdSettings size={30} color='white'/></li>
      </ul>
    </div>
  )
}

export default BottomNav