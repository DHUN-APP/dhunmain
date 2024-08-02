import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage, db } from '../../../firebase-config';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, getDoc, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import { TiArrowBack } from "react-icons/ti";
import { MdDelete } from "react-icons/md";

const EditSong = ({ songId }) => {
  const [songName, setSongName] = useState('');
  const [singer, setSinger] = useState('');
  const [coverImg, setCoverImg] = useState(null);
  const [coverImgUrl, setCoverImgUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [coverImgProgress, setCoverImgProgress] = useState(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongDetails = async () => {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const songs = userDocSnapshot.data().mysongs;
        const song = songs.find(song => song.songId === songId);
        if (song) {
          setSongName(song.songName);
          setSinger(song.singer);
          setCoverImgUrl(song.coverImgUrl);
        }
      }
    };

    fetchSongDetails();
  }, [songId, userId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!songName || !singer || !coverImgUrl) {
      alert('All fields are required!');
      return;
    }

    setUploading(true);

    try {
      let updatedCoverImgUrl = coverImgUrl;

      if (coverImg) {
        const timestamp = Date.now();
        const coverImgName = `${userId}_cover_${timestamp}`;

        // Delete the old cover image
        const oldCoverImgRef = ref(storage, coverImgUrl);
        await deleteObject(oldCoverImgRef);

        // Upload the new cover image to Firebase Storage
        const coverImgRef = ref(storage, `coverImg/${userId}/${coverImgName}`);
        const coverImgUploadTask = uploadBytesResumable(coverImgRef, coverImg);
        coverImgUploadTask.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setCoverImgProgress(progress);
        });

        await coverImgUploadTask;
        updatedCoverImgUrl = await getDownloadURL(coverImgRef);
      }

      // Get the current user document
      const userDocRef = doc(db, 'users', userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const songs = userDocSnapshot.data().mysongs;
        const updatedSongs = songs.map(song =>
          song.songId === songId
            ? { ...song, songName, singer, coverImgUrl: updatedCoverImgUrl }
            : song
        );

        // Update user's document in Firestore with updated song info
        await updateDoc(userDocRef, { mysongs: updatedSongs });
      } else {
        console.error('User document does not exist');
      }

      setUploading(false);
      toast.success('Song updated successfully', { position: "top-center", toastId: 'update-toast' });
      navigate('/app/myprofile');

    } catch (error) {
      setUploading(false);
      console.error('Error updating song:', error);
      alert('Error updating song. Please try again.');
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // Get the current user document
      const userDocRef = doc(db, 'users', userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const songs = userDocSnapshot.data().mysongs;
        const songToDelete = songs.find(song => song.songId === songId);

        if (songToDelete) {
          // Delete cover image and song file from Firebase Storage
          const coverImgRef = ref(storage, songToDelete.coverImgUrl);
          const songFileRef = ref(storage, songToDelete.songFileUrl);
          await deleteObject(coverImgRef);
          await deleteObject(songFileRef);

          // Remove song from Firestore
          const updatedSongs = songs.filter(song => song.songId !== songId);
          await updateDoc(userDocRef, { mysongs: updatedSongs });

          toast.success('Song deleted successfully', { position: "top-center", toastId: 'delete-toast' });
          navigate('/app/myprofile');
        } else {
          console.error('Song not found in user document');
        }
      } else {
        console.error('User document does not exist');
      }
    } catch (error) {
      console.error('Error deleting song:', error);
      alert('Error deleting song. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-5 mb-16">
      <div className='mb-3 flex'><div onClick={() => navigate(-1)}><TiArrowBack size={40} color='white' /></div></div>
      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <h1 className='text-xl text-textcolor font-semibold'>Song Name :</h1>
        <input
          type="text"
          placeholder="Enter Song Name..."
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
          className="p-2 outline-none rounded-lg bg-slate-600 text-white text-lg font-semibold"
          required
        />
        <h1 className='text-xl text-textcolor font-semibold'>Singer Name :</h1>
        <input
          type="text"
          placeholder="Enter Singer Name..."
          value={singer}
          onChange={(e) => setSinger(e.target.value)}
          className="p-2 outline-none rounded-lg bg-slate-600 text-white text-lg font-semibold"
          required
        />
        <h1 className='text-xl text-textcolor font-semibold'>Current Cover Image :</h1>
        <img src={coverImgUrl} alt="Cover" className="w-48 h-48 object-cover rounded-lg" />
        <h1 className='text-xl text-textcolor font-semibold'>Upload New Cover image :</h1>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverImg(e.target.files[0])}
          className="p-2 outline-none rounded-lg bg-slate-600 text-white text-lg font-semibold"
        />
        {uploading && (
          <div className="flex items-center">
            <progress value={coverImgProgress} max="100" className="rounded-lg overflow-hidden" />
            <span className="ml-2 text-lg text-textcolor font-medium">
              ({coverImgProgress.toFixed(2)}%) Uploaded
            </span>
          </div>
        )}
        <button
          type="submit"
          className="p-2 bg-slate-300 mt-4 text-slate-900 text-lg font-bold rounded"
          disabled={uploading}
        >
          {uploading ? 'Updating...' : 'Update Song'}
        </button>
        <hr className="h-1 my-5 bg-gray-600 border-0"></hr>
        {showConfirmDelete && (
          <div className="">
            <input
              type="checkbox"
              id="confirmDelete"
              checked={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.checked)}
              className=' accent-slate-400'
            />
            <label htmlFor="confirmDelete" className="ml-2 text-white text-lg font-semibold">Confirm Delete</label>
          </div>
        )}
        <button
          type="button"
          onClick={showConfirmDelete ? handleDelete : handleDeleteClick}
          className={`flex items-center justify-center gap-3 p-2 bg-red-500 text-white text-lg font-bold rounded`}
          disabled={showConfirmDelete && !confirmDelete}
        ><MdDelete size={25} />
          {deleting ? 'Deleting...' : showConfirmDelete ? 'Delete Permanently' : 'Delete'}
        </button>
      </form>
    </div>
  );
};

export default EditSong;
