



// import React, { useEffect, useState } from 'react';
// import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
// import { db } from '../../../firebase-config';
// import { useNavigate } from 'react-router-dom';
// import { TiArrowBack } from "react-icons/ti";
// import LocalLoader from '../Loaders/LocalLoader';

// const GlobalPlaylistDetails = ({ playlistId,setSongId,setArtistId}) => {
//   const [playlist, setPlaylist] = useState(null);
//   const [songsDetails, setSongsDetails] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [artistsMap, setArtistsMap] = useState({});
//   const navigate = useNavigate();


//   useEffect(() => {
//     const fetchPlaylistDetails = async () => {
//       try {
//         setIsLoading(true);
//         if (!playlistId) {
//           console.error('No playlistId provided');
//           setLoading(false);
//           return;
//         }

//         // Fetch playlist from 'playlists' collection using playlistId
//         const playlistDocRef = doc(db, 'playlists', playlistId);
//         const playlistDocSnapshot = await getDoc(playlistDocRef);

//         if (playlistDocSnapshot.exists()) {
//           const playlistData = playlistDocSnapshot.data();
//           setPlaylist(playlistData);

//           // Fetch all songs from 'artists' collection
//           const artistsRef = collection(db, 'artists');
//           const artistSnapshots = await getDocs(artistsRef);

//           // Create a map of artistId to artistName
//           const artistMap = {};
//           artistSnapshots.forEach(artistDoc => {
//             const artistData = artistDoc.data();
//             artistMap[artistDoc.id] = artistData.artistName;
//           });
//           setArtistsMap(artistMap);

//           // Create a map for quick lookup of songs
//           const songsData = [];
//           artistSnapshots.forEach(artistDoc => {
//             const artistData = artistDoc.data();
//             artistData.songs.forEach(song => {
//               songsData.push({ ...song, artistName: artistData.name, artistId: artistData.artistId });
//             });
//           });

//           // Create a map for quick lookup of songs by songId
//           const songMap = songsData.reduce((map, song) => {
//             map[song.songId] = song;
//             return map;
//           }, {});

//           // Fetch details for songs in the playlist
//           const playlistSongsDetails = playlistData.songs
//             .map(song => songMap[song.songId])
//             .filter(song => song !== undefined);
//           setSongsDetails(playlistSongsDetails);
//         } else {
//           console.error('Playlist not found');
//         }
//       } catch (error) {
//         console.error('Error fetching playlist details:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPlaylistDetails();
//   }, [playlistId]);

//   const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const handleSongClick = (songId,artistId) => {
//     setSongId(songId);
//     setArtistId(artistId);
//     navigate(`/app/songdetails`);
//   };

//   if (isLoading) {
//     return <LocalLoader/>;
//   }

//   if (!playlist) {
//     return <div>Playlist not found</div>;
//   }



//   return (
//     <div className="flex flex-col mt-10 mb-16 mx-5">
//       <div className='mb-3 flex pl-5'>
//         <div onClick={() => navigate(-1)}>
//           <TiArrowBack size={40} color='white' />
//         </div>
//       </div>

//       <div className="flex w-full max-md:flex-col">
//         <div className="w-1/5 md:p-5 flex items-center justify-center max-md:w-full">
//           <img src={playlist.coverImgUrl || 'default-cover.jpg'} alt={playlist.name} className="h-48 w-48 rounded-md" />
//         </div>
//         <div className="w-4/5 p-5 max-md:w-full">
//           <div className='text-4xl font-bold flex items-center text-textcolor'>
//             {playlist.name}
//           </div>
//         </div>
//       </div>

//       <h2 className="text-2xl max-md:text-xl my-3 font-semibold text-textcolor">Songs:</h2>
//       {songsDetails.length > 0 ? (
//         songsDetails.map((song, index) => (
//           <div onClick={() => handleSongClick(song.songId,song.artistId)} key={index} className="my-2 border-2 flex items-center p-3 rounded-md">
//             <img src={song.coverLink || 'default-song-cover.jpg'} alt={song.songName} className="h-16 w-16 rounded-md" />
//             <div className='flex ml-3 flex-col'>
//                 <div className="text-lg font-semibold text-textcolor">{song.songName}</div>
//                 <div className="text-lg font-semibold text-textcolor">By {song.artistName}</div>
//             </div>

//           </div>
//         ))
//       ) : (
//         <p>No songs found for this playlist</p>
//       )}
//     </div>
//   );
// };

// export default GlobalPlaylistDetails;



// import React, { useEffect, useState } from 'react';
// import { doc, getDoc, collection, getDocs, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
// import { db } from '../../../firebase-config';
// import { useNavigate } from 'react-router-dom';
// import { TiArrowBack } from "react-icons/ti";
// import { IoHeartOutline, IoHeart } from "react-icons/io5";
// import LocalLoader from '../Loaders/LocalLoader';
// import { useAuth } from '../../Context/AuthContext';
// import { toast } from 'react-toastify';

// const GlobalPlaylistDetails = ({ playlistId, setSongId, setArtistId }) => {
//   const [playlist, setPlaylist] = useState(null);
//   const [songsDetails, setSongsDetails] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isFollowed, setIsFollowed] = useState(false);
//   const [artistsMap, setArtistsMap] = useState({});
//   const navigate = useNavigate();
//   const { userId } = useAuth();

//   useEffect(() => {
//     const fetchPlaylistDetails = async () => {
//       try {
//         setIsLoading(true);
//         if (!playlistId) {
//           console.error('No playlistId provided');
//           setIsLoading(false);
//           return;
//         }

//         // Fetch playlist from 'playlists' collection using playlistId
//         const playlistDocRef = doc(db, 'playlists', playlistId);
//         const playlistDocSnapshot = await getDoc(playlistDocRef);

//         if (playlistDocSnapshot.exists()) {
//           const playlistData = playlistDocSnapshot.data();
//           setPlaylist(playlistData);

//           // Fetch all songs from 'artists' collection
//           const artistsRef = collection(db, 'artists');
//           const artistSnapshots = await getDocs(artistsRef);

//           // Create a map of artistId to artistName
//           const artistMap = {};
//           artistSnapshots.forEach(artistDoc => {
//             const artistData = artistDoc.data();
//             artistMap[artistDoc.id] = artistData.artistName;
//           });
//           setArtistsMap(artistMap);

//           // Create a map for quick lookup of songs
//           const songsData = [];
//           artistSnapshots.forEach(artistDoc => {
//             const artistData = artistDoc.data();
//             artistData.songs.forEach(song => {
//               songsData.push({ ...song, artistName: artistData.artistName, artistId: artistData.artistId });
//             });
//           });

//           // Create a map for quick lookup of songs by songId
//           const songMap = songsData.reduce((map, song) => {
//             map[song.songId] = song;
//             return map;
//           }, {});

//           // Fetch details for songs in the playlist
//           const playlistSongsDetails = playlistData.songs
//             .map(song => songMap[song.songId])
//             .filter(song => song !== undefined);
//           setSongsDetails(playlistSongsDetails);

//           // Check if the playlist is in the user's followed list
//           const userDocRef = doc(db, 'users', userId);
//           const userDoc = await getDoc(userDocRef);
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             setIsFollowed(userData.playlists?.includes(playlistId));
//           }
//         } else {
//           console.error('Playlist not found');
//         }
//       } catch (error) {
//         console.error('Error fetching playlist details:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPlaylistDetails();
//   }, [playlistId, userId]);

//   const handleFollowToggle = async () => {
//     try {
//       setIsLoading(true);
//       const userDocRef = doc(db, 'users', userId);
//       if (isFollowed) {
//         // Unfollow playlist
//         await updateDoc(userDocRef, {
//           playlists: arrayRemove(playlistId),
//         });
//         toast.success('Playlist unfollowed successfully!');
//       } else {
//         // Follow playlist
//         await updateDoc(userDocRef, {
//           playlists: arrayUnion(playlistId),
//         });
//         toast.success('Playlist followed successfully!');
//       }
//       setIsFollowed(!isFollowed); // Toggle the follow status
//     } catch (error) {
//       console.error('Error toggling follow status: ', error);
//       toast.error('Failed to toggle follow status.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSongClick = (songId, artistId) => {
//     setSongId(songId);
//     setArtistId(artistId);
//     navigate(`/app/songdetails`);
//   };

//   if (isLoading) {
//     return <LocalLoader />;
//   }

//   if (!playlist) {
//     return <div>Playlist not found</div>;
//   }

//   return (
//     <div className="flex flex-col mt-10 mb-16 mx-5">
//       <div className='mb-3 flex pl-5'>
//         <div onClick={() => navigate(-1)}>
//           <TiArrowBack size={40} color='white' />
//         </div>
//       </div>

//       <div className="flex w-full max-md:flex-col">
//         <div className="w-1/5 md:p-5 flex items-center justify-center max-md:w-full">
//           <img src={playlist.coverImgUrl || 'default-cover.jpg'} alt={playlist.name} className="h-48 w-48 rounded-md" />
//         </div>
//         <div className="w-4/5 p-5 max-md:w-full">
//           <div className='text-4xl font-bold flex items-center text-textcolor'>
//             {playlist.name}
//             <button
//               onClick={handleFollowToggle}
//               className='ml-4 text-white p-2 rounded-full border-2'
//             >
//               {isFollowed ? <IoHeart size={30} /> : <IoHeartOutline size={30} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       <h2 className="text-2xl max-md:text-xl my-3 font-semibold text-textcolor">Songs:</h2>
//       {songsDetails.length > 0 ? (
//         songsDetails.map((song, index) => (
//           <div onClick={() => handleSongClick(song.songId, song.artistId)} key={index} className="my-2 border-2 flex items-center p-3 rounded-md">
//             <img src={song.coverLink || 'default-song-cover.jpg'} alt={song.songName} className="h-16 w-16 rounded-md" />
//             <div className='flex ml-3 flex-col'>
//               <div className="text-lg font-semibold text-textcolor">{song.songName}</div>
//               <div className="text-lg font-semibold text-textcolor">By {song.artistName}</div>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p>No songs found for this playlist</p>
//       )}
//     </div>
//   );
// };

// export default GlobalPlaylistDetails;


import React, { useEffect, useState } from 'react';
import { doc, getDoc, collection, getDocs, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import { useNavigate } from 'react-router-dom';
import { TiArrowBack } from "react-icons/ti";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import LocalLoader from '../Loaders/LocalLoader';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';

const GlobalPlaylistDetails = ({ playlistId, setSongId, setArtistId }) => {
  const [playlist, setPlaylist] = useState(null);
  const [songsDetails, setSongsDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [artistsMap, setArtistsMap] = useState({});
  const navigate = useNavigate();
  const { userId } = useAuth();

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        setIsLoading(true);
        if (!playlistId) {
          console.error('No playlistId provided');
          setIsLoading(false);
          return;
        }

        // Fetch playlist from 'playlists' collection using playlistId
        const playlistDocRef = doc(db, 'playlists', playlistId);
        const playlistDocSnapshot = await getDoc(playlistDocRef);

        if (playlistDocSnapshot.exists()) {
          const playlistData = playlistDocSnapshot.data();
          setPlaylist(playlistData);

          // Fetch all songs from 'artists' collection
          const artistsRef = collection(db, 'artists');
          const artistSnapshots = await getDocs(artistsRef);

          // Create a map of artistId to artistName
          const artistMap = {};
          artistSnapshots.forEach(artistDoc => {
            const artistData = artistDoc.data();
            artistMap[artistDoc.id] = artistData.artistName;
          });
          setArtistsMap(artistMap);

          // Create a map for quick lookup of songs
          const songsData = [];
          artistSnapshots.forEach(artistDoc => {
            const artistData = artistDoc.data();
            artistData.songs.forEach(song => {
              songsData.push({ ...song, artistName: artistData.artistName, artistId: artistData.artistId });
            });
          });

          // Create a map for quick lookup of songs by songId
          const songMap = songsData.reduce((map, song) => {
            map[song.songId] = song;
            return map;
          }, {});

          // Fetch details for songs in the playlist
          const playlistSongsDetails = playlistData.songs
            .map(song => songMap[song.songId])
            .filter(song => song !== undefined);
          setSongsDetails(playlistSongsDetails);

          // Check if the playlist is in the user's followed list
          const userDocRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsFollowed(userData.playlists?.includes(playlistId));
          }
        } else {
          console.error('Playlist not found');
        }
      } catch (error) {
        console.error('Error fetching playlist details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylistDetails();
  }, [playlistId, userId]);

  useEffect(() => {
    const updateLastGlobalPlayedPlaylist = async () => {
      if (userId && playlistId) {
        try {
          const userDocRef = doc(db, 'users', userId);
          await updateDoc(userDocRef, {
            lastGlobalPlayedPlaylist: playlistId
          });
        } catch (error) {
          console.error('Error updating lastGlobalPlayedPlaylist field:', error);
        }
      }
    };

    updateLastGlobalPlayedPlaylist();
  }, [playlistId, userId]);

  const handleFollowToggle = async () => {
    try {
      setIsLoading(true);
      const userDocRef = doc(db, 'users', userId);
      if (isFollowed) {
        // Unfollow playlist
        await updateDoc(userDocRef, {
          playlists: arrayRemove(playlistId),
        });
        toast.success('Playlist unfollowed successfully!');
      } else {
        // Follow playlist
        await updateDoc(userDocRef, {
          playlists: arrayUnion(playlistId),
        });
        toast.success('Playlist followed successfully!');
      }
      setIsFollowed(!isFollowed); // Toggle the follow status
    } catch (error) {
      console.error('Error toggling follow status: ', error);
      toast.error('Failed to toggle follow status.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSongClick = (songId, artistId) => {
    setSongId(songId);
    setArtistId(artistId);
    navigate(`/app/songdetails`);
  };

  if (isLoading) {
    return <LocalLoader />;
  }

  if (!playlist) {
    return <div>Playlist not found</div>;
  }

  return (
    <div className="flex flex-col mt-10 mb-16 mx-5">
      <div className='mb-3 flex pl-5'>
        <div onClick={() => navigate(-1)}>
          <TiArrowBack size={40} color='white' />
        </div>
      </div>

      <div className="flex w-full max-md:flex-col">
        <div className="w-1/5 md:p-5 flex items-center justify-center max-md:w-full">
          <img src={playlist.coverImgUrl || 'default-cover.jpg'} alt={playlist.name} className="h-48 w-48 rounded-md" />
        </div>
        <div className="w-4/5 p-5 max-md:w-full">
          <div className='text-4xl font-bold flex items-center text-textcolor'>
            {playlist.name}
            <button
              onClick={handleFollowToggle}
              className='ml-4 text-white p-2 rounded-full border-2'
            >
              {isFollowed ? <IoHeart size={30} /> : <IoHeartOutline size={30} />}
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-2xl max-md:text-xl my-3 font-semibold text-textcolor">Songs:</h2>
      {songsDetails.length > 0 ? (
        songsDetails.map((song, index) => (
          <div onClick={() => handleSongClick(song.songId, song.artistId)} key={index} className="my-2 border-2 flex items-center p-3 rounded-md">
            <img src={song.coverLink || 'default-song-cover.jpg'} alt={song.songName} className="h-16 w-16 rounded-md" />
            <div className='flex ml-3 flex-col'>
              <div className="text-lg font-semibold text-textcolor">{song.songName}</div>
              <div className="text-lg font-semibold text-textcolor">By {song.artistName}</div>
            </div>
          </div>
        ))
      ) : (
        <p>No songs found for this playlist</p>
      )}
    </div>
  );
};

export default GlobalPlaylistDetails;
