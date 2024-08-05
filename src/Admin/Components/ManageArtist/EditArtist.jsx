


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase-config';
import { toast } from 'react-toastify';

const EditArtist = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState('');
  const [artistName, setArtistName] = useState('');
  const [artistId, setArtistId] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [artistType, setArtistType] = useState('');
  const [loading, setLoading] = useState(false);


  const fetchSuggestions = async (term) => {
    try {
      if (term.length === 0) {
        setSuggestions([]);
        return;
      }
  
      // Fetch all records to filter locally
      const q = query(
        collection(db, 'artists'),
        where('name', '>=', ''), // Fetch all records
        where('name', '<=', '\uf8ff') // Fetch all records
      );
  
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
  
      // Filter and sort results by relevance
      const filteredResults = results.filter((item) => {
        return item.name.toLowerCase().includes(term.toLowerCase());
      });
  
      // Sort the filtered results by the position of the search term in the name
      filteredResults.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
  
        const aMatch = aName.indexOf(term.toLowerCase());
        const bMatch = bName.indexOf(term.toLowerCase());
  
        if (aMatch !== -1 && bMatch !== -1) {
          return aMatch - bMatch; // Closer match comes first
        }
  
        if (aMatch !== -1) return -1;
        if (bMatch !== -1) return 1;
  
        return aName.localeCompare(bName);
      });
  
      setSuggestions(filteredResults);
  
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast.error('Error fetching suggestions.');
    }
  };
  

  const fetchArtistDetails = async (artistId) => {
    try {
      const docRef = doc(db, 'artists', artistId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setArtistName(data.name);
        setArtistId(data.artistId);
        setPhotoURL(data.photoURL);
        setArtistType(data.artistType);
      } else {
        toast.error('Artist not found.');
        navigate('/admin/manageartists');
      }
    } catch (error) {
      console.error('Error fetching artist details:', error);
      toast.error('Error fetching artist details.');
    }
  };

  const handleUpdateArtist = async () => {
    setLoading(true); // Set loading to true when starting the update
  
    try {
      // Proceed with the update using only the selectedArtistId
      const docRef = doc(db, 'artists', selectedArtistId);
      await updateDoc(docRef, {
        name: artistName,
        photoURL,
        artistType,
      });
  
      // Reset the form fields and states after a successful update
      setSearchTerm('');
      setSelectedArtistId('');
      setArtistName('');
      setPhotoURL('');
      setArtistType('');
      toast.success('Artist updated successfully!');
    } catch (error) {
      console.error('Error updating artist:', error);
      toast.error('Error updating artist.');
    } finally {
      setLoading(false); // Set loading to false after the update is complete
    }
  };
  

  const handleSearchTermChange = (event) => {
    const term = event.target.value;
    setSelectedArtistId('');
    setSearchTerm(term);
    fetchSuggestions(term);
  };

  const handleSuggestionClick = (artist) => {
    setSelectedArtistId(artist.id);
    fetchArtistDetails(artist.id);
    setSuggestions([]);
    setSearchTerm(artist.name);
  };

  return (
    <div className='flex flex-col w-[400px] max-md:w-[90%] overflow-y-scroll scrollbar-hide'>
      <h2 className='text-xl text-textcolor font-semibold mt-5 mb-2'>Search Artist by Name:</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchTermChange}
        placeholder="Enter artist name"
        className='w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none'
      />
      {suggestions.length > 0 && (
        <ul className='mt-2 max-h-60 overflow-y-auto'>
          {suggestions.map((artist) => (
            <li
              key={artist.id}
              onClick={() => handleSuggestionClick(artist)}
              className='p-2 font-bold bg-slate-300 mt-1 cursor-pointer rounded-md hover:bg-slate-400'
            >
              {artist.name}
            </li>
          ))}
        </ul>
      )}

      {selectedArtistId && (
        <>
          <h2 className='text-xl text-textcolor font-semibold mt-5 mb-2'>Name:</h2>
          <input
            type="text"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            placeholder="Artist Name"
            className='w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none'
            required
          />
          <h2 className='text-xl text-textcolor font-semibold mt-5 mb-2'>Photo URL:</h2>
          <input
            type="text"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            placeholder="Photo URL"
            className='w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none'
            required
          />
          <h2 className='text-xl text-textcolor font-semibold mt-5 mb-2'>Artist Type:</h2>
          <select
            value={artistType}
            onChange={(e) => setArtistType(e.target.value)}
            className='w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none'
            required
          >
            <option value="">Select Artist Type</option>
            <option value="indian_male">Indian Male</option>
            <option value="indian_female">Indian Female</option>
            <option value="foreigner_male">Foreigner Male</option>
            <option value="foreigner_female">Foreigner Female</option>
          </select>
          <button
            onClick={handleUpdateArtist}
            className='w-full p-2 flex items-center justify-center bg-primarycolor text-xl text-slate-900 font-bold rounded-md mt-10'
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Updating...' : 'Update Artist'}
          </button>
        </>
      )}
    </div>
  );
};

export default EditArtist;
