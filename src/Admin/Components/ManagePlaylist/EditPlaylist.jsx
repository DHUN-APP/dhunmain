import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase-config';
import { toast } from 'react-toastify';

const EditPlaylist = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [playlistId, setPlaylistId] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (term) => {
    try {
      if (term.length === 0) {
        setSuggestions([]);
        return;
      }

      const q = query(
        collection(db, 'playlists'),
        where('name', '>=', ''),
        where('name', '<=', '\uf8ff')
      );

      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });

      const filteredResults = results.filter((item) =>
        item.name.toLowerCase().includes(term.toLowerCase())
      );

      filteredResults.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        const aMatch = aName.indexOf(term.toLowerCase());
        const bMatch = bName.indexOf(term.toLowerCase());

        if (aMatch !== -1 && bMatch !== -1) {
          return aMatch - bMatch;
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

  const fetchPlaylistDetails = async (playlistId) => {
    try {
      const docRef = doc(db, 'playlists', playlistId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setPlaylistName(data.name);
        setPlaylistId(data.playlistId);
        setPhotoURL(data.coverImageURL);
      } else {
        toast.error('Playlist not found.');
        navigate('/admin/manageplaylists');
      }
    } catch (error) {
      console.error('Error fetching playlist details:', error);
      toast.error('Error fetching playlist details.');
    }
  };

  const handleUpdatePlaylist = async () => {
    setLoading(true);

    try {
      const docRef = doc(db, 'playlists', selectedPlaylistId);
      await updateDoc(docRef, {
        name: playlistName,
        coverImageURL: photoURL,
        updatedOn: new Date()
      });

      setSearchTerm('');
      setSelectedPlaylistId('');
      setPlaylistName('');
      setPhotoURL('');
      toast.success('Playlist updated successfully!');
    } catch (error) {
      console.error('Error updating playlist:', error);
      toast.error('Error updating playlist.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTermChange = (event) => {
    const term = event.target.value;
    setSelectedPlaylistId('');
    setSearchTerm(term);
    fetchSuggestions(term);
  };

  const handleSuggestionClick = (playlist) => {
    setSelectedPlaylistId(playlist.id);
    fetchPlaylistDetails(playlist.id);
    setSuggestions([]);
    setSearchTerm(playlist.name);
  };

  return (
    <div className='flex flex-col w-[400px] max-md:w-[90%] overflow-y-scroll scrollbar-hide'>
      <h2 className='text-xl text-textcolor font-semibold mt-5 mb-2'>Search Playlist by Name:</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchTermChange}
        placeholder="Enter playlist name"
        className='w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none'
      />
      {suggestions.length > 0 && (
        <ul className='mt-2 max-h-60 overflow-y-auto'>
          {suggestions.map((playlist) => (
            <li
              key={playlist.id}
              onClick={() => handleSuggestionClick(playlist)}
              className='p-2 font-bold bg-slate-300 mt-1 cursor-pointer rounded-md hover:bg-slate-400'
            >
              {playlist.name}
            </li>
          ))}
        </ul>
      )}

      {selectedPlaylistId && (
        <>
          <h2 className='text-xl text-textcolor font-semibold mt-5 mb-2'>Name:</h2>
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Playlist Name"
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
          <button
            onClick={handleUpdatePlaylist}
            className='w-full p-2 flex items-center justify-center bg-primarycolor text-xl text-slate-900 font-bold rounded-md mt-10'
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Playlist'}
          </button>
        </>
      )}
    </div>
  );
};

export default EditPlaylist;
