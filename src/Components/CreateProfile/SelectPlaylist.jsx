import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';
import { db } from '../../../firebase-config'; 
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import UniversalLoader from '../Loders/UniversalLoader';

const SelectPlaylists = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const playlistIds = [
    '37i9dQZF1DXbVhgADFy3im', '37i9dQZEVXbLZ52XmnySJg', '2UZk7JjJnbTut1w8fqs3JL',
    '7u5HFFZFpY6s7EnwQrcWT1', '37i9dQZF1DXdcRZAcc2QFU', '37i9dQZF1DWSKoG4oVafMt',
    '4nZo2X8iHrwhYBYdKvysgI', '04XmY48AWVmJQSE7tIYFIX', '37i9dQZF1DX14CbVHtvHRB',
    '37i9dQZF1DWTt3gMo0DLxA', '37i9dQZF1DWYztMONFqfvX', '0ldH4ltKERLCOH3zsEcQm0',
    '7cKHa9eQ8k7ATPHGpdKgqf', '1EN91xJtYSDCJtjn9t0iww', '37i9dQZF1DWYRTlrhMB12D',
    '4aQsjBuSIy3yUs8w6I2OQr', '2kt4w2RvD9YcpSq0R20r1V', '37i9dQZF1DWTqYqGLu7kTX',
    '37i9dQZF1DX5q67ZpWyRrZ', '2C2EDk8SiMQXG8hcuo0ohj', '4CuO7c8KnGI6LSrmFMIJI2',
    '0nG8Qgy8jOyT5M40mKAkYo', '0Zc2UHPeuEoqHWtnrc4Rki', '3f8aJGjwqOqz9qOV6j7WL6',
    '6je4qaBiNqjgxYdq6g1ABc', '623yWLpwYSKgdHVuub7Li0', '07wqTTsUAUEaHwVZB5sCKP',
    '3qpz8558OZHHhyu03ksdyE', '4Np9pMSyvsJ5krSH3dI5vC', '6qLwtAC2GKd12TCfH4X5Jy'
  ];

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const tokenResponse = await axios('https://accounts.spotify.com/api/token', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${import.meta.env.VITE_SPOTIFY_ID}:${import.meta.env.VITE_SPOTIFY_SECRET}`)
          },
          data: 'grant_type=client_credentials',
          method: 'POST'
        });

        const token = tokenResponse.data.access_token;

        // Fetch playlists by IDs
        const playlistPromises = playlistIds.map(id =>
          axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
            headers: { 'Authorization': 'Bearer ' + token }
          })
        );

        const playlistResponses = await Promise.all(playlistPromises);
        const playlistData = playlistResponses.map(response => response.data);
        setPlaylists(playlistData);
      } catch (error) {
        console.error('Error fetching playlist data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePlaylistSelect = (playlistId) => {
    setSelectedPlaylists((prevSelected) =>
      prevSelected.includes(playlistId)
        ? prevSelected.filter((id) => id !== playlistId)
        : [...prevSelected, playlistId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPlaylists.length < 3) {
      alert('Please choose at least 3 playlists.');
      return;
    }
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        playlists: selectedPlaylists
      }, { merge: true });
      alert('Playlists saved successfully!');
      navigate('/createprofile/plan'); // Adjust navigation as needed
    } catch (error) {
      console.error('Error saving playlists:', error);
    }
  };

  if (isLoading) {
    return <UniversalLoader />;
  }

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center overflow-auto p-4'>
      <h1 className='text-3xl text-textcolor font-bold my-5'>Select Your Favorite Playlists</h1>
      <div className='w-full h-[80vh] overflow-y-scroll scrollbar-hide grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
        {playlists.map(playlist => (
          <div
            key={playlist.id}
            className={`border-2 rounded-lg p-2 cursor-pointer transition-colors duration-300 ease-in-out ${selectedPlaylists.includes(playlist.id) ? 'border-primarycolor bg-highlight text-primarycolor' : 'border-gray-200 bg-transparent text-textcolor'}`}
            onClick={() => handlePlaylistSelect(playlist.id)}
          >
            <img src={playlist.images[0]?.url} alt={playlist.name} className='w-full h-32 object-fit rounded-lg mb-2' />
            <p className='text-md font-semibold'>{playlist.name}</p>
          </div>
        ))}
      </div>
      <button 
        onClick={handleSubmit}
        className='text-2xl text-textcolor font-semibold border-2 border-primarycolor rounded-lg px-5 py-1 mt-5'
      >
        Next
      </button>
    </div>
  );
};

export default SelectPlaylists;
