import React, {useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { FaBell } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { useAuth } from '../../Context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import { IoDiamond } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

const TopNav = () => {

  const { user, userId } = useAuth();
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

  const handleUpgradeClick = () => {
    console.log(userId)
    navigate('/app/proplan');
  };

  return (
    <div className='h-20 max-md:h-16 z-10 w-full bg-slate-800 md:rounded-t-lg flex  justify-between px-5 py-5 shadow-md shadow-slate-900 max-md:items-center max-md:px-8'>
     <div className='md:hidden text-2xl text-white font-bold'>Dhun{firestoreUser && firestoreUser.proplan && (<span>Pro</span>)}
     </div>
     <div className='flex items-center justify-center bg-slate-600 rounded-full max-md:hidden px-3 text-white font-semibold'>
        <IoIosSearch size={30} />
        <input type="text" placeholder='Search...' className='outline-none bg-slate-600 rounded-full px-1' />
     </div>
     <div className='flex space-x-4  cursor-pointer'>
     {firestoreUser && !firestoreUser.proplan && (
          <div onClick={handleUpgradeClick} className=' flex items-center justify-center md:bg-slate-600 rounded-full px-3 gap-2 text-white font-semibold'>
            <IoDiamond size={30} color='white' /><div className='max-md:hidden'>Upgrade</div>
          </div>
        )}
      <div onClick={() => navigate('/app/notifications')} className='flex justify-center items-center'><FaBell size={30} color='white'/></div>
     
     {user && firestoreUser ? (
      <img src={firestoreUser.photoURL} alt="User Avatar" height={40} width={40} className='rounded-full max-md:hidden' />
     ):(
      <FaUserCircle size={30} color='white' className='max-md:hidden' />
     )
     }

     </div>
    </div>
  )
}

export default TopNav;
