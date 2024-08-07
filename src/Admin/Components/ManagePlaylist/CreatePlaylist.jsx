import React, { useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../firebase-config';
import { toast } from 'react-toastify';

const CreatePlaylist = () => {
  const [playlistName, setPlaylistName] = useState('');
  const [playlistId, setPlaylistId] = useState('');
  const [coverImageURL, setCoverImageURL] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreatePlaylist = async (event) => {
    event.preventDefault();

    if (!playlistName || !playlistId || !coverImageURL) {
      toast.error('All fields are required.');
      return;
    }

    setLoading(true);

    try {
      const playlistDocRef = doc(db, "playlists", playlistId);
      const playlistDocSnapshot = await getDoc(playlistDocRef);

      if (playlistDocSnapshot.exists()) {
        toast.error('Playlist with this ID already exists.');
        return;
      }

      const currentTimestamp = new Date();

      await setDoc(playlistDocRef, {
        name: playlistName,
        playlistId,
        coverImageURL,
        songs: [],
        createdOn: currentTimestamp,
        updatedOn: currentTimestamp,
      });

      toast.success('Playlist created successfully!');
      setPlaylistName('');
      setPlaylistId('');
      setCoverImageURL('');
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Error creating playlist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col w-[400px] max-md:w-[90%]'>
      <form onSubmit={handleCreatePlaylist} className='flex flex-col w-full'>
        <h2 className='text-xl text-textcolor font-semibold mt-5 mb-2'>Playlist Name :</h2>
        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="Enter Playlist Name"
          className='w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none'
          required
        />
        <h2 className='text-xl text-textcolor font-semibold mt-5 mb-2'>Playlist ID :</h2>
        <input
          type="text"
          value={playlistId}
          onChange={(e) => setPlaylistId(e.target.value)}
          placeholder="Enter Unique Playlist ID"
          className='w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none'
          required
        />
        <h2 className='text-xl text-textcolor font-semibold mt-5 mb-2'>Cover Image URL :</h2>
        <input
          type="text"
          value={coverImageURL}
          onChange={(e) => setCoverImageURL(e.target.value)}
          placeholder="Enter Cover Image URL"
          className='w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none'
          required
        />
        <button
          type="submit"
          className='w-full p-2 flex items-center justify-center bg-primarycolor text-xl text-slate-900 font-bold rounded-md mt-10'
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Playlist'}
        </button>
      </form>
    </div>
  );
};

export default CreatePlaylist;
