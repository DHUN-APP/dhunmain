import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMusicalNote } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { useAuth } from '../../Context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config';

const Myplaylists = ({setPlaylistId}) => {
  const { userId } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (userId) {
        try {
          const userDocRef = doc(db, 'users', userId);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            if (Array.isArray(userData.myplaylists)) {
              setPlaylists(userData.myplaylists);
              setFilteredPlaylists(userData.myplaylists);
            } else {
              console.error('Playlists data is not an array');
            }
          } else {
            console.error('No such user document!');
          }
        } catch (error) {
          console.error('Error fetching playlists:', error);
        }
      } else {
        console.error('User ID not found');
      }
    };

    fetchPlaylists();
  }, [userId]);

  useEffect(() => {
    const filterPlaylists = () => {
      const queryLower = searchQuery.toLowerCase();
      const filtered = playlists.filter(playlist =>
        playlist.name?.toLowerCase().includes(queryLower)
      );
      setFilteredPlaylists(filtered);
    };

    filterPlaylists();
  }, [searchQuery, playlists]);

  const handleClick = async (playlistId) => {
    if (!playlistId) {
      console.error('playlistId is undefined');
      return;
    }
    console.log(playlistId);
    
    setPlaylistId(playlistId);
    console.log(playlistId);

    navigate(`/app/playlist`);
  
    if (userId) {
      try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
          lastPlayedPlaylist: playlistId
        });
      } catch (error) {
        console.error('Error updating lastPlayed field:', error);
      }
    }
  };

  return (
    <div className='p-5 max-md:p-3 flex flex-col'>
      <div className='flex justify-between max-md:flex-col'>
        <div className='flex items-center gap-5 max-md:gap-2 text-primarycolor max-md:flex-col'>
          <div className='flex items-center justify-center gap-3'>
            <IoMusicalNote size={30} />
            <h1 className='text-3xl max-md:text-xl font-semibold text-textcolor'>
              My Playlists ({filteredPlaylists.length})
            </h1>
          </div>
          <div className='ml-5 max-md:ml-3 max-md:my-5 flex items-center border-primarycolor text-white font-semibold border-b-2'>
            <IoIosSearch size={20} />
            <input
              type="text"
              placeholder='Search Playlist'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='outline-none bg-slate-800 px-1'
            />
          </div>
        </div>
        <div
          onClick={() => navigate('/app/addplaylist')}
          className='max-md:my-5 flex items-center justify-center text-textcolor font-bold gap-2 py-1 px-3 border-2 rounded-full border-primarycolor max-md:bg-primarycolor max-md:text-slate-900 cursor-pointer'
        >
          <FaPlus /> New Playlist
        </div>
      </div>

      <div className='flex space-x-3 mt-10 max-md:mt-3 overflow-auto'>
        {filteredPlaylists.length > 0 ? (
          filteredPlaylists.map((playlist) => (
            <div
              key={playlist.id || playlist.name} // Fallback to playlist.name if playlist.id is not defined
              onClick={() => handleClick(playlist.playlistId)}
              className='flex flex-col rounded-md border-2 max-w-24 cursor-pointer'
            >
              <p className='px-2 text-md font-semibold text-textcolor'>{playlist.name}</p>
              <img 
                src={playlist.coverImgUrl || 'default-cover.jpg'} 
                alt={`Cover for playlist ${playlist.name}`} 
                className='h-24 w-24 bg-slate-500' 
              />
            </div>
          ))
        ) : (
          <p className='text-lg font-semibold text-textcolor'>No playlists found</p>
        )}
      </div>
    </div>
  );
};

export default Myplaylists;
