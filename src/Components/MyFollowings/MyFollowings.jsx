import React, { useEffect, useState } from 'react';
import { IoPerson } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { db } from '../../../firebase-config';
import { useAuth } from '../../Context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const MyFollowings = ({ setArtistId }) => {
  const { userId } = useAuth();
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const artistsData = await Promise.all(
            (userData.artists || []).map(async (artistId) => {
              const artistDocRef = doc(db, 'artists', artistId);
              const artistDoc = await getDoc(artistDocRef);
              if (artistDoc.exists()) {
                return { ...artistDoc.data(), artistId }; // Include artistId
              } else {
                return null;
              }
            })
          );
          setArtists(artistsData.filter(artist => artist !== null));
        }
      } catch (error) {
        console.error("Error fetching artists: ", error);
      }
    };

    if (userId) {
      fetchArtists();
    }
  }, [userId]);

  useEffect(() => {
    const filterArtists = () => {
      const queryLower = searchQuery.toLowerCase();
      const filtered = artists.filter(artist =>
        artist.name?.toLowerCase().includes(queryLower)
      );
      setFilteredArtists(filtered);
    };

    filterArtists();
  }, [searchQuery, artists]);

  const handleArtistClick = (artistId) => {
    setArtistId(artistId); // Set the artist ID in parent component
    navigate(`/app/followingdetails`); // Navigate to the details page
  };

  return (
    <div className='p-5 max-md:p-3 flex flex-col'>
      <div className='flex justify-between max-md:flex-col'>
        <div className='flex items-center gap-5 max-md:gap-2 text-primarycolor max-md:flex-col'>
          <div className='flex items-center justify-center gap-3'>
            <IoPerson size={30} />
            <h1 className='text-3xl max-md:text-xl font-semibold text-textcolor'>
              My Followings ({filteredArtists.length}/{artists.length})
            </h1>
          </div>
          <div className='ml-5 max-md:ml-3 max-md:my-5 flex items-center border-primarycolor text-white font-semibold border-b-2'>
            <IoIosSearch size={20} />
            <input
              type="text"
              placeholder='Search Artist'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='outline-none bg-slate-800 px-1'
            />
          </div>
        </div>
      </div>
      <div className='flex flex-wrap gap-4 mt-10 max-md:mt-3'>
        {filteredArtists.length > 0 ? (
          filteredArtists.map((artist) => (
            <div
              key={artist.artistId}
              onClick={() => handleArtistClick(artist.artistId)}
              className='flex flex-col items-center cursor-pointer'
            >
              <img
                src={artist.photoURL || 'default-image-url'}
                alt={artist.name}
                className='h-24 w-24 rounded-full object-cover mb-2 border-4 border-white'
              />
              <p className='text-center text-textcolor text-sm font-semibold'>
                {artist.name}
              </p>
            </div>
          ))
        ) : (
          <p className='text-lg font-semibold text-textcolor'>No artists found</p>
        )}
      </div>
    </div>
  );
}

export default MyFollowings;
