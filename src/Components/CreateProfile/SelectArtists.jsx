import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';
import { db } from '../../../firebase-config';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import UniversalLoader from '../Loders/UniversalLoader';

const SelectArtists = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const artistIds = [
    '1wRPtKGflJrBx9BmLsSwlU', '4YRxDV8wJFPHPTeXepOstw', '1mYsTxnqsietFxj1OgoGbG',
    '2FKWNmZWDBZR4dE5KX4plR', '6LEG9Ld1aLImEFEVHdWNSB', '5C1S9XwxMuuCciutwMhp5t',
    '2cjQTf2J5yCaNY8qHpW855',
    '72beYOeW2sb2yfcS4JsRvb', '4Ai0pGz6GhQavjzaRhPTvz', '5NHm4TU5Twz7owibYxJfFU',
    '1mBydYMVBECdDmMfE2sEUO', '4zCH9qm4R2DADamUHMCa6O', '5wJ1H6ud777odtZl5gG507',
    '5T2I75UlGBcWd5nVyfmL13', '7uIbLdzzSEqnX0Pkrb56cR', '0y59o4v8uw5crbN9M3JiL1',
    '4fEkbug6kZzzJ8eYX6Kbbp', '4K6blSRoklNdpw4mzLxwfn', '0sSxphmGskGCKlwB9xa6WU',
    '2oSONSC9zQ4UonDKnLqksx', '2GoeZ0qOTt6kjsWW4eA6LS', '0oOet2f43PA68X5RxKobEy',
    '2jqTyPt0UZGrthPF4KMpeN', '63gvl4egwBtz2czz3aENGa', '2o4R2rK7FetH40HTv0SUWl',
    '7o7doCwqft91WC690aglWC', '53XhwfbYqKCa1cC15pYq2q', '3Nrfpe0tUJi4K4DXYWgMUX',
    '2fMqTqiTxUDlmcOEPaQSsx', '3gBKY0y3dFFVRqicLnVZYz', '6Mv8GjQa7LKUGCAqa9qqdb',
    '45PG2L6Fh2XvYL4ONzpdoW', '1Oh5bPXjw5jreVFhKc4jux',
    '4PULA4EFzYTrxYvOVlwpiQ', '70B80Lwx2sxti0M1Ng9e8K', '1dVygo6tRFXC8CSWURQJq2',
    '3Isy6kedDrgPYoTS1dazA9', '6M2wZ9GZgrQXHCFfjv46we', '4V8Sr092TqfHkfAA5fXXqG',
    '3TVXtAsR1Inumwj472S9r4', '06HL4z0CvFAxyc27GXpf02', '4q3ewBCX7sLwd24euuV69X',
    '1Xyo4u8uXC1ZmMpatF05PJ', '1uNFoZAHBGtllmzznpCI3s', '6eUKZXaKkcviH0Ku9w2n3V',
    '7dGJo4pcD2V6oG8kP0tJRR', '66CXWjxzNUsdJxJ2JdwvnR', '5K4W6rqBFWDnAN6FQUkS6x',
    '0Y5tJX1MQlPlqiwlOH1tJY'
  ];

  useEffect(() => {
    const fetchData = async () => {
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

        // Fetch artists by IDs
        const artistPromises = artistIds.map(id =>
          axios.get(`https://api.spotify.com/v1/artists/${id}`, {
            headers: { 'Authorization': 'Bearer ' + token }
          })
        );

        const artistResponses = await Promise.all(artistPromises);
        const artistData = artistResponses.map(response => response.data);
        setArtists(artistData);
      } catch (error) {
        console.error('Error fetching artist data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleArtistSelect = (artistId) => {
    setSelectedArtists((prevSelected) =>
      prevSelected.includes(artistId)
        ? prevSelected.filter((id) => id !== artistId)
        : [...prevSelected, artistId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedArtists.length < 3) {
      alert('Please select at least 3 artists.');
      return;
    }
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        artist: selectedArtists
      }, { merge: true });
      alert('Artists saved successfully!');
      navigate('/createprofile/playlist');
    } catch (error) {
      console.error('Error saving artists:', error);
    }
  };

  if (isLoading) {
    return <UniversalLoader />;
  }

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center overflow-auto p-4'>
      <h1 className='text-3xl text-textcolor font-bold my-5'>Select Your Favorite Artists</h1>
      <div className='w-full h-[80vh] overflow-y-scroll scrollbar-hide grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
        {artists.map(artist => (
          <div
            key={artist.id}
            className={`border-2 rounded-lg p-2 cursor-pointer transition-colors duration-300 ease-in-out ${selectedArtists.includes(artist.id) ? 'border-primarycolor bg-highlight text-primarycolor' : 'border-gray-200 bg-transparent text-textcolor'}`}
            onClick={() => handleArtistSelect(artist.id)}
          >
            <img src={artist.images[0]?.url} alt={artist.name} className='w-full h-27 object-cover rounded-full mb-2' />
            <p className='text-md font-semibold'>{artist.name}</p>
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

export default SelectArtists;
