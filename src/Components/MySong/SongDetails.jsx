// import React, { useEffect, useState, useRef } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../../../firebase-config';
// import { useAuth } from '../../Context/AuthContext';
// import MusicPlayer from './MusicPlayer';

// const SongDetails = ({ songId }) => {
//   const [song, setSong] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [duration, setDuration] = useState(null);
//   const audioRef = useRef(null);
//   const { userId } = useAuth();

//   useEffect(() => {
//     const fetchSongDetails = async () => {
//       try {
//         const userDocRef = doc(db, 'users', userId);
//         const userDocSnapshot = await getDoc(userDocRef);

//         if (userDocSnapshot.exists()) {
//           const userData = userDocSnapshot.data();
//           const mySongs = userData.mysongs || [];
//           const songDetails = mySongs.find(song => song.songId === songId);
//           setSong(songDetails);
//         } else {
//           console.error('User document does not exist');
//         }
//       } catch (error) {
//         console.error('Error fetching song details:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSongDetails();
//   }, [songId, userId]);

//   const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const handleLoadedMetadata = () => {
//     if (audioRef.current) {
//       setDuration(audioRef.current.duration);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!song) {
//     return <div>Song not found</div>;
//   }

//   return (
//     <div className="flex flex-col">
//       <div className='flex w-full'>
//         <div className='w-1/5 p-5 flex items-center justify-center'>
//           <img src={song.coverImgUrl} alt={song.songName} className="h-48 w-48 rounded-md" />
//         </div>
//         <div className='w-4/5 p-5'>
//           <h1 className='text-5xl font-bold text-textcolor'>{song.songName}</h1>
//           <h2 className='text-2xl my-3 font-semibold text-textcolor'>By {song.singer}</h2>
//           <hr className="h-1 my-5 bg-gray-200 border-0 dark:bg-gray-700"></hr>
//           <div className='flex items-center text-lg font-semibold text-textcolor'>Duration: <div className='text-sm font-normal ml-3'>{duration ? `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}` : 'Loading...'}</div></div>
//           <div className='flex items-center text-lg font-semibold text-textcolor'>Uploaded on: <div className='text-sm font-normal ml-3'>{formatTimestamp(song.timestamp)}</div></div>
//         </div>
//       </div>
//       <div className='h-1/2'>
//         <MusicPlayer songFileUrl={song.songFileUrl} />
//       </div>
//     </div>
//   );
// };

// export default SongDetails;


import React, { useEffect, useState, useRef } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import { useAuth } from '../../Context/AuthContext';
import MusicPlayer from './MusicPlayer';
import { MdEdit } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { TiArrowBack } from "react-icons/ti";
import LocalLoader from '../Loaders/LocalLoader';


const SongDetails = ({ songId }) => {
  const [song, setSong] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(null);
  const audioRef = useRef(null);
  const { userId } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        setIsLoading(true);
        const userDocRef = doc(db, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const mySongs = userData.mysongs || [];

          const effectiveSongId = songId || userData.lastPlayed;

          if (effectiveSongId) {
            const songDetails = mySongs.find(song => song.songId === effectiveSongId);
            setSong(songDetails);
          } else {
            console.error('No song ID provided and no last played song found');
          }
        } else {
          console.error('User document does not exist');
        }
      } catch (error) {
        console.error('Error fetching song details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongDetails();
  }, [songId, userId]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  if(isLoading){
    return <LocalLoader/>
  }

  if (!song) {
    return <div>Song not found</div>;
  }

  return (
    <div className="flex flex-col mt-10">
      <div className='mb-3 flex pl-5'><div onClick={() => navigate(-1)}><TiArrowBack size={40} color='white' /></div></div>
      <div className="flex w-full max-md:flex-col">
        <div className="w-1/5 md:p-5 flex items-center justify-center max-md:w-full">
          <img src={song.coverImgUrl} alt={song.songName} className="h-48 w-48 rounded-md" />
        </div>
        <div className="w-4/5 p-5 max-md:w-full">
            <div className='flex justify-between items-center '>
              <div className='text-4xl font-bold flex items-center text-textcolor '>{song.songName}</div>
              <div onClick={() => navigate('/app/editsong')} className='flex items-center justify-center px-6 max-md:px-3 text-lg font-semibold py-2 max-md:py-1 bg-slate-300 gap-2 max-md:gap-1 rounded-full'><MdEdit size={20} />Edit</div>
            </div>
          <h2 className="text-2xl max-md:text-xl my-3 font-semibold text-textcolor">By {song.singer}</h2>
          <hr className="h-1 my-5 bg-gray-200 border-0 dark:bg-gray-700"></hr>
          <div className="flex items-center text-lg font-semibold text-textcolor">Duration: <div className="text-sm font-normal ml-3">{duration ? `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}` : 'Loading...'}</div></div>
          <div className="flex items-center text-lg font-semibold text-textcolor">Uploaded on: <div className='text-sm font-normal ml-3'>{formatTimestamp(song.timestamp)}</div></div>
        </div>
      </div>
      <div className='mb-5'>
        <MusicPlayer 
          songFileUrl={song.songFileUrl} 
          audioRef={audioRef} 
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>
    </div>
  );
};

export default SongDetails;

