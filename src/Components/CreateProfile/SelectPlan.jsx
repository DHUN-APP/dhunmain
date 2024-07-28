// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { doc, setDoc } from 'firebase/firestore';
// import { db } from '../../../firebase-config'; 
// import { useAuth } from '../../Context/AuthContext';

// const SelectPlan = () => {
//   const { userId } = useAuth();
//   const navigate = useNavigate();

//   const handlePlanSelect = async (planType) => {
//     try {
//       const userDocRef = doc(db, 'users', userId);
//       await setDoc(userDocRef, {
//         plan: planType
//       }, { merge: true });
//       navigate('/home');
//     } catch (error) {
//       console.error('Error updating plan:', error);
//     }
//   };

//   return (
//     <div className='w-full h-screen flex flex-col items-center justify-center p-6'>
//       <h1 className='text-3xl text-textcolor font-bold my-5'>Select Plan</h1>
//       <div className='flex space-x-4'>
//         {/* Free Plan Card */}
//         <div className='w-64 p-4 bg-green-500 shadow-lg rounded-2xl dark:bg-gray-800'>
//           <div className='flex items-center justify-between text-white'>
//             <p className='mb-4 text-4xl font-medium'>Free</p>
//             <p className='flex flex-col text-3xl font-bold'>
//             ₹0
//               <span className='text-sm font-thin text-right'>month</span>
//             </p>
//           </div>
//           <p className='mt-4 text-white text-md'>Plan includes:</p>
//           <ul className='w-full mt-6 mb-6 text-sm text-white'>
//             <li className='mb-3 flex items-center'>
//               <svg className='w-6 h-6 mr-2' xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 1792 1792'>
//                 <path d='M1412 734q0-28-18-46l-91-90q-19-19-45-19t-45 19l-408 407-226-226q-19-19-45-19t-45 19l-91 90q-18 18-18 46 0 27 18 45l362 362q19 19 45 19 27 0 46-19l543-543q18-18 18-45zm252 162q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z'/>
//               </svg>
//               Basic features
//             </li>
//             <li className='mb-3 flex items-center opacity-50'>
//               <svg className='w-6 h-6 mr-2' xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 1792 1792'>
//                 <path d='M1277 1122q0-26-19-45l-181-181 181-181q19-19 19-45 0-27-19-46l-90-90q-19-19-46-19-26 0-45 19l-181 181-181-181q-19-19-45-19-27 0-46 19l-90 90q-19 19-19 46 0 26 19 45l181 181-181 181q-19 19-19 45 0 27 19 46l90 90q19 19 46 19 26 0 45-19l181-181 181 181q19 19 45 19 27 0 46-19l90-90q19-19 19-46zm387-226q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z'/>
//               </svg>
//               Unlimited Songs
//             </li>
//             <li className='mb-3 flex items-center opacity-50'>
//               <svg className='w-6 h-6 mr-2' xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 1792 1792'>
//                 <path d='M1277 1122q0-26-19-45l-181-181 181-181q19-19 19-45 0-27-19-46l-90-90q-19-19-46-19-26 0-45 19l-181 181-181-181q-19-19-45-19-27 0-46 19l-90 90q-19 19-19 46 0 26 19 45l181 181-181 181q-19 19-19 45 0 27 19 46l90 90q19 19 46 19 26 0 45-19l181-181 181 181q19 19 45 19 27 0 46-19l90-90q19-19 19-46zm387-226q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z'/>
//               </svg>
//               Ad-free music listening
//             </li>
//             <li className='mb-3 flex items-center opacity-50'>
//               <svg className='w-6 h-6 mr-2' xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 1792 1792'>
//                 <path d='M1277 1122q0-26-19-45l-181-181 181-181q19-19 19-45 0-27-19-46l-90-90q-19-19-46-19-26 0-45 19l-181 181-181-181q-19-19-45-19-27 0-46 19l-90 90q-19 19-19 46 0 26 19 45l181 181-181 181q-19 19-19 45 0 27 19 46l90 90q19 19 46 19 26 0 45-19l181-181 181 181q19 19 45 19 27 0 46-19l90-90q19-19 19-46zm387-226q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z'/>
//               </svg>
//               Download to listen offline
//             </li>
//           </ul>
//           <button
//             onClick={() => handlePlanSelect('Free')}
//             className='text-xl text-textcolor font-semibold border-2 border-primarycolor rounded-lg px-5 py-1 mt-5'
//           >
//             Choose Free Plan
//           </button>
//         </div>

//         {/* Premium Plan Card */}
//         <div className='w-64 p-4 bg-indigo-500 shadow-lg rounded-2xl dark:bg-gray-800'>
//           <div className='flex items-center justify-between text-white'>
//             <p className='mb-4 text-4xl font-medium'>Pro</p>
//             <p className='flex flex-col text-3xl font-bold'>
//             ₹99
//               <span className='text-sm font-thin text-right'>month</span>
//             </p>
//           </div>
//           <p className='mt-4 text-white text-md'>Plan includes:</p>
//           <ul className='w-full mt-6 mb-6 text-sm text-white'>
//             <li className='mb-3 flex items-center'>
//               <svg className='w-6 h-6 mr-2' xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 1792 1792'>
//                 <path d='M1412 734q0-28-18-46l-91-90q-19-19-45-19t-45 19l-408 407-226-226q-19-19-45-19t-45 19l-91 90q-18 18-18 46 0 27 18 45l362 362q19 19 45 19 27 0 46-19l543-543q18-18 18-45zm252 162q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z'/>
//               </svg>
//               Unlimited Songs
//             </li>
//             <li className='mb-3 flex items-center'>
//               <svg className='w-6 h-6 mr-2' xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 1792 1792'>
//                 <path d='M1412 734q0-28-18-46l-91-90q-19-19-45-19t-45 19l-408 407-226-226q-19-19-45-19t-45 19l-91 90q-18 18-18 46 0 27 18 45l362 362q19 19 45 19 27 0 46-19l543-543q18-18 18-45zm252 162q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z'/>
//               </svg>
//               Custom Playlist
//             </li>
//             <li className='mb-3 flex items-center'>
//               <svg className='w-6 h-6 mr-2' xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 1792 1792'>
//                 <path d='M1412 734q0-28-18-46l-91-90q-19-19-45-19t-45 19l-408 407-226-226q-19-19-45-19t-45 19l-91 90q-18 18-18 46 0 27 18 45l362 362q19 19 45 19 27 0 46-19l543-543q18-18 18-45zm252 162q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z'/>
//               </svg>
//               Ad-free music listening
//             </li>
//             <li className='mb-3 flex items-center'>
//               <svg className='w-6 h-6 mr-2' xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 1792 1792'>
//                 <path d='M1412 734q0-28-18-46l-91-90q-19-19-45-19t-45 19l-408 407-226-226q-19-19-45-19t-45 19l-91 90q-18 18-18 46 0 27 18 45l362 362q19 19 45 19 27 0 46-19l543-543q18-18 18-45zm252 162q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z'/>
//               </svg>
//               Download to listen offline
//             </li>            
//           </ul>
//           <button
//             onClick={() => handlePlanSelect('Pro')}
//             className='text-xl text-textcolor font-semibold border-2 border-primarycolor rounded-lg px-5 py-1 mt-5'
//           >
//             Choose Pro Plan
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SelectPlan;


import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config'; 
import { useAuth } from '../../Context/AuthContext';
import UniversalLoader from '../Loaders/UniversalLoader';


const SelectPlan = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handlePlanSelect = async (planType) => {
    try {
      setIsLoading(true);
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        proplan: planType
      }, { merge: true });
      navigate('/app/home');
    } catch (error) {
      console.error('Error updating plan:', error);
    } finally{
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <UniversalLoader />;
  }

  return (
    <div className='w-full h-screen flex flex-col items-center md:justify-center'>
      <h1 className='text-3xl text-textcolor font-bold mb-10 max-md:mb-5 max-md:mt-10'>Select Plan</h1>
      <div className='flex max-md:flex-col gap-5'>
        {/* Free Plan Card */}
        <div className='w-64 p-4 shadow-lg rounded-2xl bg-gray-800'>
          <div className='flex items-center justify-between text-white'>
            <p className='mb-4 text-4xl max-md:text-2xl font-medium'>Free</p>
            <p className='flex flex-col text-3xl max-md:text-2xl font-bold'>
            ₹0
              <span className='text-sm font-thin text-right'>/ month</span>
            </p>
          </div>
          <p className='mt-4 max-md:mt-1 text-white text-lg'>Plan includes:</p>
          <ul className='w-full mt-6 max-md:mt-3 mb-6 text-sm text-white'>
            <li className='mb-3 flex items-center'>
              <svg className='w-6 h-6 mr-2' xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 1792 1792'>
                <path d='M1412 734q0-28-18-46l-91-90q-19-19-45-19t-45 19l-408 407-226-226q-19-19-45-19t-45 19l-91 90q-18 18-18 46 0 27 18 45l362 362q19 19 45 19 27 0 46-19l543-543q18-18 18-45zm252 162q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z'/>
              </svg>
              Basic features
            </li>
            <li className='mb-3 flex items-center opacity-50'>
              <svg className='w-6 h-6 mr-2' xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 1792 1792'>
                <path d='M1277 1122q0-26-19-45l-181-181 181-181q19-19 19-45 0-27-19-46l-90-90q-19-19-46-19-26 0-45 19l-181 181-181-181q-19-19-45-19-27 0-46 19l-90 90q-19 19-19 46 0 26 19 45l181 181-181 181q-19 19-19 45 0 27 19 46l90 90q19 19 46 19 26 0 45-19l181-181 181 181q19 19 45 19 27 0 46-19l90-90q19-19 19-46zm387-226q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z'/>
              </svg>
              Unlimited Songs
            </li>
            <li className='mb-3 flex items-center opacity-50'>
              <svg className='w-6 h-6 mr-2' xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 1792 1792'>
                <path d='M1277 1122q0-26-19-45l-181-181 181-181q19-19 19-45 0-27-19-46l-90-90q-19-19-46-19-26 0-45 19l-181 181-181-181q-19-19-45-19-27 0-46 19l-90 90q-19 19-19 46 0 26 19 45l181 181-181 181q-19 19-19 45 0 27 19 46l90 90q19 19 46 19 26 0 45-19l181-181 181 181q19 19 45 19 27 0 46-19l90-90q19-19 19-46zm387-226q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z'/>
              </svg>
              Ad-free music listening
            </li>
            <li className='mb-3 max-md:mb-1 flex items-center opacity-50'>
              <svg className='w-6 h-6 mr-2' xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 1792 1792'>
                <path d='M1277 1122q0-26-19-45l-181-181 181-181q19-19 19-45 0-27-19-46l-90-90q-19-19-46-19-26 0-45 19l-181 181-181-181q-19-19-45-19-27 0-46 19l-90 90q-19 19-19 46 0 26 19 45l181 181-181 181q-19 19-19 45 0 27 19 46l90 90q19 19 46 19 26 0 45-19l181-181 181 181q19 19 45 19 27 0 46-19l90-90q19-19 19-46zm387-226q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z'/>
              </svg>
              Download to listen offline
            </li>
          </ul>
          <button
            onClick={() => handlePlanSelect(false)}
            className='text-xl w-full text-textcolor font-semibold border-2 border-primarycolor rounded-lg px-5 py-1 md:mt-5 '
          >
            Choose Free Plan
          </button>
        </div>
        {/* Pro Plan Card */}
        <div className='w-64 p-4 shadow-lg rounded-2xl bg-gray-800'>
          <div className='flex items-center justify-between text-white'>
            <p className='mb-4 text-4xl max-md:text-2xl font-medium'>Pro</p>
            <p className='flex flex-col text-3xl max-md:text-2xl font-bold'>
            ₹149
              <span className='text-sm font-thin text-right'>/ month</span>
            </p>
          </div>
          <p className='mt-4 max-md:mt-1 text-white text-lg'>Plan includes:</p>
          <ul className='w-full mt-6 max-md:mt-3 mb-6 text-sm text-white'>
            <li className='mb-3 flex items-center'>
              <svg className='w-6 h-6 mr-2' xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 1792 1792'>
                <path d='M1412 734q0-28-18-46l-91-90q-19-19-45-19t-45 19l-408 407-226-226q-19-19-45-19t-45 19l-91 90q-18 18-18 46 0 27 18 45l362 362q19 19 45 19 27 0 46-19l543-543q18-18 18-45zm252 162q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z'/>
              </svg>
              Basic features
            </li>
            <li className='mb-3 flex items-center'>
            <svg className='w-6 h-6 mr-2' xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 1792 1792'>
                <path d='M1412 734q0-28-18-46l-91-90q-19-19-45-19t-45 19l-408 407-226-226q-19-19-45-19t-45 19l-91 90q-18 18-18 46 0 27 18 45l362 362q19 19 45 19 27 0 46-19l543-543q18-18 18-45zm252 162q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z'/>
              </svg>
              Unlimited Songs
            </li>
            <li className='mb-3 flex items-center'>
            <svg className='w-6 h-6 mr-2' xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 1792 1792'>
                <path d='M1412 734q0-28-18-46l-91-90q-19-19-45-19t-45 19l-408 407-226-226q-19-19-45-19t-45 19l-91 90q-18 18-18 46 0 27 18 45l362 362q19 19 45 19 27 0 46-19l543-543q18-18 18-45zm252 162q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z'/>
              </svg>
              Ad-free music listening
            </li>
            <li className='mb-3 max-md:mb-1 flex items-center'>
            <svg className='w-6 h-6 mr-2' xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 1792 1792'>
                <path d='M1412 734q0-28-18-46l-91-90q-19-19-45-19t-45 19l-408 407-226-226q-19-19-45-19t-45 19l-91 90q-18 18-18 46 0 27 18 45l362 362q19 19 45 19 27 0 46-19l543-543q18-18 18-45zm252 162q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z'/>
              </svg>
              Download to listen offline
            </li>
          </ul>
          <button
            onClick={() => handlePlanSelect(true)}
            className='text-xl w-full text-textcolor font-semibold border-2 border-primarycolor rounded-lg px-5 py-1 md:mt-5 '
          >
            Choose Pro Plan
          </button>
        </div>

      </div>
    </div>
  );
};

export default SelectPlan;
