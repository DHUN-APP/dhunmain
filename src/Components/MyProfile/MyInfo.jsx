import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import { MdEdit } from "react-icons/md";

const MyInfo = () => {
  const { user, userId } = useAuth();
  const [firestoreUser, setFirestoreUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!firestoreUser) {
    return <div>No user data found</div>;
  }

  return (
    <div className='flex w-full p-5'>
      {user && (
        <div className="w-full flex max-md:flex-col max-md:items-center">

          <div className='md:w-1/5 flex justify-center items-center'>
            <div className='bg-slate-300 p-1 rounded-full'><img src={firestoreUser.photoURL} height={100} width={100} alt="" className='rounded-full' /></div>
          </div>

          <div className='md:w-4/5 flex flex-col'>
            <div className='flex justify-between items-center md:h-2/3 max-md:my-5 '>
              <div className='text-4xl max-md:text-2xl font-bold flex items-center text-textcolor '>{firestoreUser.name}</div>
              <div className='flex items-center justify-center px-6 max-md:px-3 text-lg font-semibold py-2 max-md:py-1 bg-slate-300 gap-2 max-md:gap-1 rounded-full'><MdEdit size={20} />Edit</div>
            </div>
            <div className='text-xl max-md:text-lg font-semibold md:h-1/3 flex items-center text-textcolor'>10 Songs | 5 Public PlayLists | 200 Followers | 10 Followings</div>
          </div>

        </div>
      )}
    </div>
  );
}

export default MyInfo;
