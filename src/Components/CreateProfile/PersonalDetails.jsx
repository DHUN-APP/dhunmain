import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase-config'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../Context/AuthContext'; 
import UniversalLoader from '../Loders/UniversalLoader';

const PersonalDetails = () => {
  const [isLoading , setIsLoading]=useState(true);
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [name, setFirstName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.name);
          // Set other fields if necessary
        }
      } catch (e) {
        console.error('Error fetching user data: ', e);
      }finally{
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        name,
        dob,
        gender
      }, { merge: true });
      alert('Personal details submitted successfully!');
      navigate('/createprofile/genres'); // Navigate to the next page after successful update
    } catch (e) {
      console.error('Error updating document: ', e);
    }
  };

  if(isLoading){
    return <UniversalLoader/>
  }

 
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
      <h1 className='text-3xl text-textcolor font-bold my-5'>Personal Details</h1>
      <form className='flex flex-col items-center space-y-4' onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Name" 
          className='border-2 border-primarycolor rounded-lg px-3 py-1'
          value={name} 
          onChange={(e) => setFirstName(e.target.value)}            
        />       
        <div className='relative w-full'>
          <input 
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)} 
            className='border-2 border-primarycolor rounded-lg px-3 py-1 w-full appearance-none'
            min="1920-01-01"
            max={today}
            required 
          />
          <div className='absolute top-1/2 transform -translate-y-1/2 left-3 pointer-events-none'>
            <span className='text-gray-500'>
              {dob === '' ? 'DOB' : `${dob}`}
            </span>
          </div>
        </div>
        <select 
          className='border-2 border-primarycolor rounded-lg px-3 py-1 w-full'
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="" disabled>Choose Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <button 
          type="submit" 
          className='text-2xl text-textcolor font-semibold border-2 border-primarycolor rounded-lg px-5 py-1 mt-5'
        >
          Next
        </button>
      </form>
    </div>  
  );
}

export default PersonalDetails;
