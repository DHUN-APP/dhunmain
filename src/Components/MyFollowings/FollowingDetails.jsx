




// import React, { useEffect, useState } from 'react';
// import { db } from '../../../firebase-config';
// import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
// import { useAuth } from '../../Context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { IoPersonRemove } from "react-icons/io5";

// const FollowingDetails = ({artistId,setSongId}) => {
//   console.log(setSongId);
  
//   const [artist, setArtist] = useState(null);
//   const [songs, setSongs] = useState([]);
//   const { userId } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchArtistDetails = async () => {
//       try {
//         const artistDocRef = doc(db, 'artists', artistId);
//         const artistDoc = await getDoc(artistDocRef);
//         if (artistDoc.exists()) {
//           const artistData = artistDoc.data();
//           setArtist(artistData);
//           setSongs(artistData.songs || []);
//         } else {
//           console.log('No such artist document!');
//         }
//       } catch (error) {
//         console.error("Error fetching artist details: ", error);
//       }
//     };

//     if (artistId) {
//       fetchArtistDetails();
//     }
//   }, [artistId]);

//   const handleUnfollow = async () => {
//     try {
//       const userDocRef = doc(db, 'users', userId);
//       await updateDoc(userDocRef, {
//         artists: arrayRemove(artistId),
//       });
//       navigate('/app/myprofile');  // Redirect to followings list after unfollowing
//     } catch (error) {
//       console.error("Error unfollowing artist: ", error);
//     }
//   };

//   const handleSongClick = (songId) => {
//     setSongId(songId);
//     navigate(`/app/songdetails`);
//   };
  

//   return (
//     <div className='p-5 max-md:p-3 flex flex-col relative mb-16 mt-8'>
//       {artist ? (
//         <div>
//           <button
//             onClick={handleUnfollow}
//             className='absolute top-5 right-5 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition duration-300 border-2'
//           >
//             <IoPersonRemove size={20} />
//           </button>
//           {/* Artist's Profile Image and Name */}
//           <div className='flex flex-col items-center mb-10'>
//             <img
//               src={artist.photoURL || 'default-image-url'}
//               alt={artist.name}
//               className='h-40 w-40 rounded-full object-cover mb-4 border-4 border-white'
//             />
//             <h1 className='text-4xl font-semibold text-textcolor'>{artist.name}</h1>
//           </div>

//           {/* List of Songs */}
//           <div>
//             <h2 className='text-2xl font-semibold text-textcolor mb-4'>Songs</h2>
//             <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
//               {songs.length > 0 ? (
//                 songs.map((song, index) => (
//                   <div
//                     key={index}
//                     className='flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300 border-2 cursor-pointer'
//                     onClick={() => handleSongClick(song.songId)}
//                   >
//                     <img
//                       src={song.coverLink || 'default-cover.jpg'}
//                       alt={song.songName}
//                       className='h-20 w-20 rounded object-cover'
//                     />
//                     <div className='flex flex-col'>
//                       <p className='text-textcolor text-lg font-semibold'>{song.songName}</p>
//                       <p className='text-gray-400 text-sm'>{artist.name}</p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className='text-lg font-semibold text-textcolor'>No songs found</p>
//               )}
//             </div>
//           </div>
//         </div>
//       ) : (
//         <p className='text-lg font-semibold text-textcolor'>Loading...</p>
//       )}
//     </div>
//   );
// }

// export default FollowingDetails;


import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase-config';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { IoPersonRemove, IoPersonAdd } from "react-icons/io5";
import { toast } from 'react-toastify';
import { TiArrowBack } from "react-icons/ti";
import LocalLoader from '../Loaders/LocalLoader';

const FollowingDetails = ({ artistId, setSongId }) => {
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        setIsLoading(true);
        const artistDocRef = doc(db, 'artists', artistId);
        const artistDoc = await getDoc(artistDocRef);
        if (artistDoc.exists()) {
          const artistData = artistDoc.data();
          setArtist(artistData);
          setSongs(artistData.songs || []);

          // Check if the artist is in the user's followed list
          const userDocRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsFollowed(userData.artists?.includes(artistId));
          }
        } else {
          console.log('No such artist document!');
        }
      } catch (error) {
        console.error("Error fetching artist details: ", error);
      }finally {
        setIsLoading(false);
      }
    };

    if (artistId) {
      fetchArtistDetails();
    }
  }, [artistId, userId]);

  const handleFollowToggle = async () => {
    try {
      setIsLoading(true);
      const userDocRef = doc(db, 'users', userId);
      if (isFollowed) {
        // Unfollow artist
        await updateDoc(userDocRef, {
          artists: arrayRemove(artistId),
        });
        toast.success('Artist Unfollowed Successfully!');
      } else {
        // Follow artist
        await updateDoc(userDocRef, {
          artists: arrayUnion(artistId),
        });
        toast.success('Artist followed Successfully!');
      }
      setIsFollowed(!isFollowed); // Toggle the follow status
    } catch (error) {
      console.error("Error toggling follow status: ", error);
      toast.error('Failed to toggle follow status.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSongClick = (songId) => {
    setSongId(songId);
    navigate(`/app/songdetails`);
  };

  if(isLoading){
    return <LocalLoader/>
  }

  return (
    <div className='p-5 max-md:p-3 flex flex-col relative mt-8 mb-16'>
      <div className='mb-3 flex'><div onClick={() => navigate(-1)}><TiArrowBack size={40} color='white' /></div></div>
      {artist ? (
        <div>
          <button
            onClick={handleFollowToggle}
            className='absolute top-5 right-5 text-white p-2 rounded-full border-2'
          >
            {isFollowed ? <IoPersonRemove size={30} /> : <IoPersonAdd size={30} />}
          </button>
          {/* Artist's Profile Image and Name */}
          <div className='flex flex-col items-center mb-10'>
            <img
              src={artist.photoURL || 'default-image-url'}
              alt={artist.name}
              className='h-40 w-40 rounded-full object-cover mb-4 border-4 border-white'
            />
            <h1 className='text-4xl font-semibold text-textcolor'>{artist.name}</h1>
          </div>

          {/* List of Songs */}
          <div>
            <h2 className='text-2xl font-semibold text-textcolor mb-4'>Songs</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {songs.length > 0 ? (
                songs.map((song, index) => (
                  <div
                    key={index}
                    className='flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300 border-2 cursor-pointer'
                    onClick={() => handleSongClick(song.songId)}
                  >
                    <img
                      src={song.coverLink || 'default-cover.jpg'}
                      alt={song.songName}
                      className='h-20 w-20 rounded object-cover'
                    />
                    <div className='flex flex-col'>
                      <p className='text-textcolor text-lg font-semibold'>{song.songName}</p>
                      <p className='text-gray-400 text-sm'>{artist.name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-lg font-semibold text-textcolor'>No songs found</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className='text-lg font-semibold text-textcolor'>Loading...</p>
      )}
    </div>
  );
};

export default FollowingDetails;
