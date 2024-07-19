
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from '../../firebase-config';
import { useAuth } from '../Context/AuthContext';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

import { UilGoogle } from "@iconscout/react-unicons";
import UniversalLoader from '../Components/Loders/UniversalLoader';

const AuthLogin = () => {
  const navigate = useNavigate();
  const { setUser, setUserId } = useAuth();
  const [isFirestoreLoading, setIsFirestoreLoading] = useState(false);

  useEffect(() => {
    const autoLogin = localStorage.getItem('autoLogin');
    if (autoLogin) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const storedUserId = localStorage.getItem('userId');
      if (storedUser && storedUserId) {
        setUser(storedUser);
        setUserId(storedUserId);
        navigate('/home');
      }
    }
  }, [navigate, setUser, setUserId]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
      setUserId(user.uid);

      setIsFirestoreLoading(true);
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          gender: "Not Set",
          dob: "Not Set",
          userId: user.uid,
        });
      }
      localStorage.setItem('autoLogin', 'true');
      setIsFirestoreLoading(false);
      navigate('/home');
    } catch (error) {
      console.error('Error during Google login', error);
      setIsFirestoreLoading(false);
    }
  };

  if (isFirestoreLoading) {
    return <UniversalLoader />;
  }

  return (
    <div className='flex items-center justify-center flex-col w-full h-svh'>
      <h1 className='text-5xl max-md:text-3xl text-textcolor font-bold my-10'>Welcome To Dhun</h1>
      <button className='flex gap-5 text-xl border-2 border-primary py-3 px-5 rounded-xl text-textcolor' onClick={handleGoogleLogin}>
        <UilGoogle size="30" color="white" />Login with Google</button>
    </div>
  );
};

export default AuthLogin;
