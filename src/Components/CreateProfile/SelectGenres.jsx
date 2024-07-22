import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext'; 
import { db } from '../../../firebase-config';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import UniversalLoader from '../Loders/UniversalLoader';

const genreIds = [
  '0JQ5DAqbMKFz6FAsUtgAab', '0JQ5DArNBzkmxXHCqFLx2J', '0JQ5DAqbMKFQIL0AXnG5AK',
  '0JQ5DAqbMKFHCxg5H5PtqW', '0JQ5DAqbMKFKSopHMaeIeI', '0JQ5DAqbMKFQ00XGBls6ym',
  '0JQ5DAqbMKFE33XAyDiPIr', '0JQ5DAqbMKFIdOwkMWR5at', '0JQ5DAqbMKFAUsdyVjCQuL',
  '0JQ5DAqbMKFA6SOHvT3gck', '0JQ5DAqbMKFEC4WFtoNRpw', '0JQ5DAqbMKFAJ5xb0fwo9m',
  '0JQ5DAqbMKFKtQGjXD19nw', '0JQ5DAqbMKFB7mJpXZv2vV', '0JQ5DAqbMKFDXXwE9BDJAr',
  '0JQ5DAqbMKFAEu5QlAkwvV', '0JQ5DAqbMKFEcBibYcDrCH', '0JQ5DAqbMKFGvOw3O4nLAf',
  '0JQ5DAqbMKFOTGtSOysEXE', '0JQ5DAqbMKFRieVZLLoo9m', '0JQ5DAqbMKFHOzuVTgTizF',
  '0JQ5DAqbMKFPrEiAOxgac3', '0JQ5DAqbMKFCWjUTdzaG0e', '0JQ5DAqbMKFFzDl7qN9Apr',
  '0JQ5DAqbMKFLVaM30PMBm4', '0JQ5DAqbMKFAXlCG6QvYQ4', '0JQ5DAqbMKFAQy4HL4XU2D',
  '0JQ5DAqbMKFCuoRTxhYWow', '0JQ5DAqbMKFCbimwdOYlsl', '0JQ5DAqbMKFy78wprEpAjl'
];

const SelectGenres = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
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

        // Fetch genre details by IDs
        const genrePromises = genreIds.map(id => 
          axios.get(`https://api.spotify.com/v1/browse/categories/${id}`, {
            headers: { 'Authorization': 'Bearer ' + token }
          })
        );

        const genreResponses = await Promise.all(genrePromises);
        const genreData = genreResponses.map(response => response.data);
        setGenres(genreData);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreSelect = (genreId) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genreId)
        ? prevSelected.filter((id) => id !== genreId)
        : [...prevSelected, genreId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedGenres.length < 3) {
      alert('Please choose at least 3 genres.');
      return;
    }
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        genres: selectedGenres
      }, { merge: true });
      alert('Genres saved successfully!');
      navigate('/createprofile/artists');
    } catch (error) {
      console.error('Error saving genres:', error);
    }
  };

  if (isLoading) {
    return <UniversalLoader />;
  }

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center overflow-auto p-4'>
      <h1 className='text-3xl text-textcolor font-bold my-5'>Select Your Favorite Genres</h1>
      <div className='w-full h-[80vh] overflow-y-scroll scrollbar-hide grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
        {genres.map(genre => (
          <div
            key={genre.id}
            className={`border-2 rounded-lg p-2 cursor-pointer transition-colors duration-300 ease-in-out ${selectedGenres.includes(genre.id) ? 'border-primarycolor bg-highlight text-primarycolor' : 'border-gray-200 bg-transparent text-textcolor'}`}
            onClick={() => handleGenreSelect(genre.id)}
          >
            <img src={genre.icons[0]?.url} alt={genre.name} className='w-full h-32 object-cover rounded-lg mb-2' />
            <p className='text-md font-semibold'>{genre.name}</p>
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

export default SelectGenres;
