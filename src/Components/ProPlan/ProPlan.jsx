import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import { useAuth } from '../../Context/AuthContext';

const ProPlan = () => {
  const navigate = useNavigate();
  const { user, userId } = useAuth();

  const handleUpgrade = async () => {
    if (userId) {
      try {
        const q = query(collection(db, "users"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        let docId = null;
        querySnapshot.forEach((doc) => {
          docId = doc.id;
        });

        if (docId) {
          const userDocRef = doc(db, 'users', docId);
          await updateDoc(userDocRef, { proplan: true });
          navigate('/app/home');
          window.location.reload();
        } else {
          console.log('No user document found with the given userId');
        }
      } catch (error) {
        console.error('Error updating document:', error);
      }
    } else {
      console.log('userId is not defined');
    }
  };

  return (
    <div className='flex justify-center text-xl text-textcolor'>
      <div className='flex flex-col items-center'>
        <button onClick={handleUpgrade} className='bg-slate-600 text-white px-4 py-2 rounded-md'>
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
};

export default ProPlan;

