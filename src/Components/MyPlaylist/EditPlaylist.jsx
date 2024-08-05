// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { db, storage } from '../../../firebase-config';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// import { useAuth } from '../../Context/AuthContext';
// import { toast } from 'react-toastify';
// import { TiArrowBack } from "react-icons/ti";
// import { MdDelete } from "react-icons/md";

// const EditPlaylist = ({ playlistId }) => {
//   const [playlistName, setPlaylistName] = useState('');
//   const [selectedSongs, setSelectedSongs] = useState([]);
//   const [availableSongs, setAvailableSongs] = useState([]);
//   const [coverImg, setCoverImg] = useState(null);
//   const [coverImgUrl, setCoverImgUrl] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [coverImgProgress, setCoverImgProgress] = useState(0);
//   const [showConfirmDelete, setShowConfirmDelete] = useState(false);
//   const [confirmDelete, setConfirmDelete] = useState(false);
//   const [songsInPlaylist, setSongsInPlaylist] = useState([]);
//   const { userId } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPlaylistAndSongs = async () => {
//       const userDocRef = doc(db, 'users', userId);
//       const userDocSnapshot = await getDoc(userDocRef);

//       if (userDocSnapshot.exists()) {
//         const userData = userDocSnapshot.data();
//         const playlists = userData.myplaylists;
//         const playlist = playlists.find(playlist => playlist.playlistId === playlistId);

//         if (playlist) {
//           setPlaylistName(playlist.name);
//           setSelectedSongs(playlist.songs);
//           setCoverImgUrl(playlist.coverImgUrl);
//           setSongsInPlaylist(playlist.songs); // Set songs already in the playlist
//         }

//         // Fetch available songs
//         const mySongs = userData.mysongs || [];
//         setAvailableSongs(mySongs);
//       }
//     };

//     fetchPlaylistAndSongs();
//   }, [playlistId, userId]);

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!playlistName || !selectedSongs.length) {
//       alert('Playlist name and at least one song are required!');
//       return;
//     }

//     setUploading(true);

//     try {
//       let updatedCoverImgUrl = coverImgUrl;

//       if (coverImg) {
//         const timestamp = Date.now();
//         const coverImgName = `${userId}_playlist_cover_${timestamp}`;

//         // Delete the old cover image if it exists
//         if (coverImgUrl) {
//           const oldCoverImgRef = ref(storage, coverImgUrl);
//           await deleteObject(oldCoverImgRef);
//         }

//         // Upload the new cover image to Firebase Storage
//         const coverImgRef = ref(storage, `playlistCoverImg/${userId}/${coverImgName}`);
//         const coverImgUploadTask = uploadBytesResumable(coverImgRef, coverImg);
//         coverImgUploadTask.on('state_changed', (snapshot) => {
//           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           setCoverImgProgress(progress);
//         });

//         await coverImgUploadTask;
//         updatedCoverImgUrl = await getDownloadURL(coverImgRef);
//       }

//       // Get the current user document
//       const userDocRef = doc(db, 'users', userId);
//       const userDocSnapshot = await getDoc(userDocRef);

//       if (userDocSnapshot.exists()) {
//         const playlists = userDocSnapshot.data().myplaylists;
//         const updatedPlaylists = playlists.map(playlist =>
//           playlist.playlistId === playlistId
//             ? { ...playlist, name: playlistName, songs: selectedSongs, coverImgUrl: updatedCoverImgUrl, updatetimestamp: new Date().toISOString() }
//             : playlist
//         );

//         // Update user's document in Firestore with updated playlist info
//         await updateDoc(userDocRef, { myplaylists: updatedPlaylists });
//       } else {
//         console.error('User document does not exist');
//       }

//       setUploading(false);
//       toast.success('Playlist updated successfully', { position: "top-center", toastId: 'update-toast' });
//       navigate('/app/myprofile');

//     } catch (error) {
//       setUploading(false);
//       console.error('Error updating playlist:', error);
//       alert('Error updating playlist. Please try again.');
//     }
//   };

//   const handleDeleteClick = () => {
//     setShowConfirmDelete(true);
//   };

//   const handleDelete = async () => {
//     setDeleting(true);
//     try {
//       // Get the current user document
//       const userDocRef = doc(db, 'users', userId);
//       const userDocSnapshot = await getDoc(userDocRef);

//       if (userDocSnapshot.exists()) {
//         const playlists = userDocSnapshot.data().myplaylists;
//         const playlistToDelete = playlists.find(playlist => playlist.playlistId === playlistId);

//         if (playlistToDelete) {
//           // Delete cover image from Firebase Storage if it exists
//           if (playlistToDelete.coverImgUrl) {
//             const coverImgRef = ref(storage, playlistToDelete.coverImgUrl);
//             await deleteObject(coverImgRef);
//           }

//           // Remove playlist from Firestore
//           const updatedPlaylists = playlists.filter(playlist => playlist.playlistId !== playlistId);
//           await updateDoc(userDocRef, { myplaylists: updatedPlaylists });

//           toast.success('Playlist deleted successfully', { position: "top-center", toastId: 'delete-toast' });
//           navigate('/app/myprofile');
//         } else {
//           console.error('Playlist not found in user document');
//         }
//       } else {
//         console.error('User document does not exist');
//       }
//     } catch (error) {
//       console.error('Error deleting playlist:', error);
//       alert('Error deleting playlist. Please try again.');
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const handleSongSelection = (e) => {
//     const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
//     setSelectedSongs(selectedOptions);
//   };

//   const handleRemoveSong = (songId) => {
//     setSelectedSongs(selectedSongs.filter(id => id !== songId));
//   };

//   if (!playlistName) return <div>Loading...</div>;

//   return (
//     <div className="p-5 mb-16">
//       <div className='mb-3 flex'><div onClick={() => navigate(-1)}><TiArrowBack size={40} color='white' /></div></div>
//       <form onSubmit={handleUpload} className="flex flex-col gap-4">
//         <h1 className='text-xl text-textcolor font-semibold'>Playlist Name :</h1>
//         <input
//           type="text"
//           placeholder="Enter Playlist Name..."
//           value={playlistName}
//           onChange={(e) => setPlaylistName(e.target.value)}
//           className="p-2 outline-none rounded-lg bg-slate-600 text-white text-lg font-semibold"
//           required
//         />
//         <h1 className='text-xl text-textcolor font-semibold'>Add Songs :</h1>
//         <select
//           multiple
//           value={selectedSongs}
//           onChange={handleSongSelection}
//           className="mt-1 block w-full p-2 border border-gray-300 rounded bg-slate-600 text-white"
//         >
//           {availableSongs.map((song) => (
//             <option key={song.songId} value={song.songId}>
//               {song.songName}
//             </option>
//           ))}
//         </select>
//         <div className="mt-4">
//           <h2 className='text-xl text-textcolor font-semibold'>Songs in Playlist:</h2>
//           {songsInPlaylist.length > 0 ? (
//             <ul className="list-disc pl-5">
//               {songsInPlaylist.map((songId) => {
//                 const song = availableSongs.find((s) => s.songId === songId);
//                 return (
//                   <li key={songId} className="flex items-center justify-between mb-2 bg-slate-700 p-2 rounded-lg">
//                     <span className="text-white">{song?.songName}</span>
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveSong(songId)}
//                       className="ml-2 p-1 bg-red-500 text-white text-sm font-bold rounded hover:bg-red-600"
//                     >
//                       Remove
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           ) : (
//             <p className="text-white">No songs in playlist</p>
//           )}
//         </div>
//         <h1 className='text-xl text-textcolor font-semibold'>Current Cover Image :</h1>
//         {coverImgUrl ? (
//           <img src={coverImgUrl} alt="Cover" className="w-48 h-48 object-cover rounded-lg" />
//         ) : (
//           <p>No cover image</p>
//         )}
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setCoverImg(e.target.files[0])}
//           className="p-2 outline-none rounded-lg bg-slate-600 text-white text-lg font-semibold"
//         />
//         {uploading && (
//           <div className="mt-2 text-white">
//             Uploading cover image... {Math.round(coverImgProgress)}%
//           </div>
//         )}
//         <button
//           type="submit"
//           disabled={uploading}
//           className="mt-4 p-2 bg-blue-600 text-white text-lg font-bold rounded hover:bg-blue-700"
//         >
//           {uploading ? 'Updating Playlist...' : 'Update Playlist'}
//         </button>
//       </form>
//       <div className="mt-4">
//         <button
//           type="button"
//           onClick={handleDeleteClick}
//           className="p-2 bg-red-600 text-white text-lg font-bold rounded hover:bg-red-700"
//         >
//           Delete Playlist
//         </button>
//         {showConfirmDelete && (
//           <div className="mt-2 bg-gray-800 p-4 rounded">
//             <p className="text-white">Are you sure you want to delete this playlist? This action cannot be undone.</p>
//             <div className="mt-2 flex justify-end gap-2">
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmDelete(false)}
//                 className="p-2 bg-gray-600 text-white text-lg font-bold rounded hover:bg-gray-700"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleDelete}
//                 className="p-2 bg-red-600 text-white text-lg font-bold rounded hover:bg-red-700"
//                 disabled={deleting}
//               >
//                 {deleting ? 'Deleting...' : 'Confirm Delete'}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EditPlaylist;


//============================================================================================================================

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { db, storage } from '../../../firebase-config';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// import { useAuth } from '../../Context/AuthContext';
// import { toast } from 'react-toastify';
// import { TiArrowBack } from "react-icons/ti";
// import { MdDelete } from "react-icons/md";

// const EditPlaylist = ({ playlistId }) => {
//   const [playlistName, setPlaylistName] = useState('');
//   const [selectedSongs, setSelectedSongs] = useState([]);
//   const [availableSongs, setAvailableSongs] = useState([]);
//   const [coverImg, setCoverImg] = useState(null);
//   const [coverImgUrl, setCoverImgUrl] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [coverImgProgress, setCoverImgProgress] = useState(0);
//   const [showConfirmDelete, setShowConfirmDelete] = useState(false);
//   const [confirmDelete, setConfirmDelete] = useState(false);
//   const { userId } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPlaylistAndSongs = async () => {
//       const userDocRef = doc(db, 'users', userId);
//       const userDocSnapshot = await getDoc(userDocRef);

//       if (userDocSnapshot.exists()) {
//         const userData = userDocSnapshot.data();
//         const playlists = userData.myplaylists;
//         const playlist = playlists.find(playlist => playlist.playlistId === playlistId);

//         if (playlist) {
//           setPlaylistName(playlist.name);
//           setSelectedSongs(playlist.songs);
//           setCoverImgUrl(playlist.coverImgUrl);
//         }

//         // Fetch available songs
//         const mySongs = userData.mysongs || [];
//         setAvailableSongs(mySongs);
//       }
//     };

//     fetchPlaylistAndSongs();
//   }, [playlistId, userId]);

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!playlistName || !selectedSongs.length) {
//       alert('Playlist name and at least one song are required!');
//       return;
//     }

//     setUploading(true);

//     try {
//       let updatedCoverImgUrl = coverImgUrl;

//       if (coverImg) {
//         const timestamp = Date.now();
//         const coverImgName = `${userId}_playlist_cover_${timestamp}`;

//         // Delete the old cover image if it exists
//         if (coverImgUrl) {
//           const oldCoverImgRef = ref(storage, coverImgUrl);
//           await deleteObject(oldCoverImgRef);
//         }

//         // Upload the new cover image to Firebase Storage
//         const coverImgRef = ref(storage, `playlistCoverImg/${userId}/${coverImgName}`);
//         const coverImgUploadTask = uploadBytesResumable(coverImgRef, coverImg);
//         coverImgUploadTask.on('state_changed', (snapshot) => {
//           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           setCoverImgProgress(progress);
//         });

//         await coverImgUploadTask;
//         updatedCoverImgUrl = await getDownloadURL(coverImgRef);
//       }

//       // Get the current user document
//       const userDocRef = doc(db, 'users', userId);
//       const userDocSnapshot = await getDoc(userDocRef);

//       if (userDocSnapshot.exists()) {
//         const playlists = userDocSnapshot.data().myplaylists;
//         const updatedPlaylists = playlists.map(playlist =>
//           playlist.playlistId === playlistId
//             ? { ...playlist, name: playlistName, songs: selectedSongs, coverImgUrl: updatedCoverImgUrl, updatetimestamp: new Date().toISOString() }
//             : playlist
//         );

//         // Update user's document in Firestore with updated playlist info
//         await updateDoc(userDocRef, { myplaylists: updatedPlaylists });
//       } else {
//         console.error('User document does not exist');
//       }

//       setUploading(false);
//       toast.success('Playlist updated successfully', { position: "top-center", toastId: 'update-toast' });
//       navigate('/app/myprofile');

//     } catch (error) {
//       setUploading(false);
//       console.error('Error updating playlist:', error);
//       alert('Error updating playlist. Please try again.');
//     }
//   };

//   const handleDeleteClick = () => {
//     setShowConfirmDelete(true);
//   };

//   const handleDelete = async () => {
//     setDeleting(true);
//     try {
//       // Get the current user document
//       const userDocRef = doc(db, 'users', userId);
//       const userDocSnapshot = await getDoc(userDocRef);

//       if (userDocSnapshot.exists()) {
//         const playlists = userDocSnapshot.data().myplaylists;
//         const playlistToDelete = playlists.find(playlist => playlist.playlistId === playlistId);

//         if (playlistToDelete) {
//           // Delete cover image from Firebase Storage if it exists
//           if (playlistToDelete.coverImgUrl) {
//             const coverImgRef = ref(storage, playlistToDelete.coverImgUrl);
//             await deleteObject(coverImgRef);
//           }

//           // Remove playlist from Firestore
//           const updatedPlaylists = playlists.filter(playlist => playlist.playlistId !== playlistId);
//           await updateDoc(userDocRef, { myplaylists: updatedPlaylists });

//           toast.success('Playlist deleted successfully', { position: "top-center", toastId: 'delete-toast' });
//           navigate('/app/myprofile');
//         } else {
//           console.error('Playlist not found in user document');
//         }
//       } else {
//         console.error('User document does not exist');
//       }
//     } catch (error) {
//       console.error('Error deleting playlist:', error);
//       alert('Error deleting playlist. Please try again.');
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const handleSongSelection = async (e) => {
//     const selectedSongId = e.target.value;

//     if (!selectedSongs.includes(selectedSongId)) {
//       setSelectedSongs(prevSongs => [...prevSongs, selectedSongId]);

//       try {
//         const userDocRef = doc(db, 'users', userId);
//         const userDocSnapshot = await getDoc(userDocRef);

//         if (userDocSnapshot.exists()) {
//           const playlists = userDocSnapshot.data().myplaylists;
//           const updatedPlaylists = playlists.map(playlist =>
//             playlist.playlistId === playlistId
//               ? { ...playlist, songs: [...playlist.songs, selectedSongId], updatetimestamp: new Date().toISOString() }
//               : playlist
//           );

//           // Update user's document in Firestore with updated playlist info
//           await updateDoc(userDocRef, { myplaylists: updatedPlaylists });
//         } else {
//           console.error('User document does not exist');
//         }
//       } catch (error) {
//         console.error('Error updating playlist:', error);
//         alert('Error updating playlist. Please try again.');
//       }
//     }
//   };

//   const handleRemoveSong = async (songId) => {
//     setSelectedSongs(selectedSongs.filter(id => id !== songId));

//     try {
//       const userDocRef = doc(db, 'users', userId);
//       const userDocSnapshot = await getDoc(userDocRef);

//       if (userDocSnapshot.exists()) {
//         const playlists = userDocSnapshot.data().myplaylists;
//         const updatedPlaylists = playlists.map(playlist =>
//           playlist.playlistId === playlistId
//             ? { ...playlist, songs: playlist.songs.filter(id => id !== songId), updatetimestamp: new Date().toISOString() }
//             : playlist
//         );

//         // Update user's document in Firestore with updated playlist info
//         await updateDoc(userDocRef, { myplaylists: updatedPlaylists });
//       } else {
//         console.error('User document does not exist');
//       }
//     } catch (error) {
//       console.error('Error updating playlist:', error);
//       alert('Error updating playlist. Please try again.');
//     }
//   };

//   if (!playlistName) return <div>Loading...</div>;

//   return (
//     <div className="p-5 mb-16">
//       <div className='mb-3 flex'><div onClick={() => navigate(-1)}><TiArrowBack size={40} color='white' /></div></div>
//       <form onSubmit={handleUpload} className="flex flex-col gap-4">
//         <h1 className='text-xl text-textcolor font-semibold'>Playlist Name :</h1>
//         <input
//           type="text"
//           placeholder="Enter Playlist Name..."
//           value={playlistName}
//           onChange={(e) => setPlaylistName(e.target.value)}
//           className="p-2 outline-none rounded-lg bg-slate-600 text-white text-lg font-semibold"
//           required
//         />
//         <h1 className='text-xl text-textcolor font-semibold'>Add Songs :</h1>
//         <select
//           value=""
//           onChange={handleSongSelection}
//           className="p-2 outline-none rounded-lg bg-slate-600 text-white text-lg font-semibold"
//         >
//           <option value="" disabled>Select a song to add</option>
//           {availableSongs.map(song => (
//             <option key={song.id} value={song.id}>{song.name}</option>
//           ))}
//         </select>
//         <div className="flex flex-col gap-2">
//           <h2 className="text-lg text-textcolor font-semibold">Selected Songs:</h2>
//           {selectedSongs.map((songId) => (
//             <div key={songId} className="flex justify-between items-center bg-slate-700 p-2 rounded-lg">
//               <span>{availableSongs.find(song => song.id === songId)?.name}</span>
//               <button
//                 type="button"
//                 onClick={() => handleRemoveSong(songId)}
//                 className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//         </div>
//         <h1 className='text-xl text-textcolor font-semibold'>Cover Image :</h1>
//         {coverImgUrl ? (
//           <img src={coverImgUrl} alt="Cover" className="w-full h-48 object-cover rounded-lg" />
//         ) : (
//           <p>No cover image</p>
//         )}
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setCoverImg(e.target.files[0])}
//           className="p-2 outline-none rounded-lg bg-slate-600 text-white text-lg font-semibold"
//         />
//         {uploading && (
//           <div className="mt-2 text-white">
//             Uploading cover image... {Math.round(coverImgProgress)}%
//           </div>
//         )}
//         <button
//           type="submit"
//           disabled={uploading}
//           className="mt-4 p-2 bg-blue-600 text-white text-lg font-bold rounded hover:bg-blue-700"
//         >
//           {uploading ? 'Updating Playlist...' : 'Update Playlist'}
//         </button>
//       </form>
//       <div className="mt-4">
//         <button
//           type="button"
//           onClick={handleDeleteClick}
//           className="p-2 bg-red-600 text-white text-lg font-bold rounded hover:bg-red-700"
//         >
//           Delete Playlist
//         </button>
//         {showConfirmDelete && (
//           <div className="mt-2 bg-gray-800 p-4 rounded">
//             <p className="text-white">Are you sure you want to delete this playlist? This action cannot be undone.</p>
//             <div className="mt-2 flex justify-end gap-2">
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmDelete(false)}
//                 className="p-2 bg-gray-600 text-white text-lg font-bold rounded hover:bg-gray-700"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleDelete}
//                 className="p-2 bg-red-600 text-white text-lg font-bold rounded hover:bg-red-700"
//                 disabled={deleting}
//               >
//                 {deleting ? 'Deleting...' : 'Confirm Delete'}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EditPlaylist;

// ==============================================================


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { db, storage } from '../../../firebase-config';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
// import { useAuth } from '../../Context/AuthContext';
// import { toast } from 'react-toastify';
// import { TiArrowBack } from "react-icons/ti";
// import { MdDelete } from "react-icons/md";

// const EditPlaylist = ({ playlistId }) => {
//   const [playlistName, setPlaylistName] = useState('');
//   const [selectedSongs, setSelectedSongs] = useState([]);
//   const [availableSongs, setAvailableSongs] = useState([]);
//   const [coverImg, setCoverImg] = useState(null);
//   const [coverImgUrl, setCoverImgUrl] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [coverImgProgress, setCoverImgProgress] = useState(0);
//   const [showConfirmDelete, setShowConfirmDelete] = useState(false);
//   const [confirmDelete, setConfirmDelete] = useState(false);
//   const { userId } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPlaylistAndSongs = async () => {
//       const userDocRef = doc(db, 'users', userId);
//       const userDocSnapshot = await getDoc(userDocRef);

//       if (userDocSnapshot.exists()) {
//         const userData = userDocSnapshot.data();
//         const playlists = userData.myplaylists;
//         const playlist = playlists.find(playlist => playlist.playlistId === playlistId);

//         if (playlist) {
//           setPlaylistName(playlist.name);
//           setSelectedSongs(playlist.songs);
//           setCoverImgUrl(playlist.coverImgUrl);
//         }

//         // Fetch available songs from 'mysongs'
//         const mySongs = userData.mysongs || [];
//         setAvailableSongs(mySongs);
//       }
//     };

//     fetchPlaylistAndSongs();
//   }, [playlistId, userId]);

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!playlistName || !selectedSongs.length) {
//       alert('Playlist name and at least one song are required!');
//       return;
//     }

//     setUploading(true);

//     try {
//       let updatedCoverImgUrl = coverImgUrl;

//       if (coverImg) {
//         const timestamp = Date.now();
//         const coverImgName = `${userId}_playlist_cover_${timestamp}`;

//         // Delete the old cover image if it exists
//         if (coverImgUrl) {
//           const oldCoverImgRef = ref(storage, coverImgUrl);
//           await deleteObject(oldCoverImgRef);
//         }

//         // Upload the new cover image to Firebase Storage
//         const coverImgRef = ref(storage, `playlistCoverImg/${userId}/${coverImgName}`);
//         const coverImgUploadTask = uploadBytesResumable(coverImgRef, coverImg);
//         coverImgUploadTask.on('state_changed', (snapshot) => {
//           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           setCoverImgProgress(progress);
//         });

//         await coverImgUploadTask;
//         updatedCoverImgUrl = await getDownloadURL(coverImgRef);
//       }

//       // Get the current user document
//       const userDocRef = doc(db, 'users', userId);
//       const userDocSnapshot = await getDoc(userDocRef);

//       if (userDocSnapshot.exists()) {
//         const playlists = userDocSnapshot.data().myplaylists;
//         const updatedPlaylists = playlists.map(playlist =>
//           playlist.playlistId === playlistId
//             ? { ...playlist, name: playlistName, songs: selectedSongs, coverImgUrl: updatedCoverImgUrl, updatetimestamp: new Date().toISOString() }
//             : playlist
//         );

//         // Update user's document in Firestore with updated playlist info
//         await updateDoc(userDocRef, { myplaylists: updatedPlaylists });
//       } else {
//         console.error('User document does not exist');
//       }

//       setUploading(false);
//       toast.success('Playlist updated successfully', { position: "top-center", toastId: 'update-toast' });
//       navigate('/app/myprofile');

//     } catch (error) {
//       setUploading(false);
//       console.error('Error updating playlist:', error);
//       alert('Error updating playlist. Please try again.');
//     }
//   };

//   const handleDeleteClick = () => {
//     setShowConfirmDelete(true);
//   };

//   const handleDelete = async () => {
//     setDeleting(true);
//     try {
//       // Get the current user document
//       const userDocRef = doc(db, 'users', userId);
//       const userDocSnapshot = await getDoc(userDocRef);

//       if (userDocSnapshot.exists()) {
//         const playlists = userDocSnapshot.data().myplaylists;
//         const playlistToDelete = playlists.find(playlist => playlist.playlistId === playlistId);

//         if (playlistToDelete) {
//           // Delete cover image from Firebase Storage if it exists
//           if (playlistToDelete.coverImgUrl) {
//             const coverImgRef = ref(storage, playlistToDelete.coverImgUrl);
//             await deleteObject(coverImgRef);
//           }

//           // Remove playlist from Firestore
//           const updatedPlaylists = playlists.filter(playlist => playlist.playlistId !== playlistId);
//           await updateDoc(userDocRef, { myplaylists: updatedPlaylists });

//           toast.success('Playlist deleted successfully', { position: "top-center", toastId: 'delete-toast' });
//           navigate('/app/myprofile');
//         } else {
//           console.error('Playlist not found in user document');
//         }
//       } else {
//         console.error('User document does not exist');
//       }
//     } catch (error) {
//       console.error('Error deleting playlist:', error);
//       alert('Error deleting playlist. Please try again.');
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const handleSongSelection = (e) => {
//     const selectedSongId = e.target.value;
//     const selectedSong = availableSongs.find(song => song.songId === selectedSongId);

//     if (selectedSong && !selectedSongs.some(song => song.songId === selectedSongId)) {
//       setSelectedSongs(prevSongs => [...prevSongs, selectedSong]);
//     }
//   };

//   const handleRemoveSong = (songId) => {
//     setSelectedSongs(selectedSongs.filter(song => song.songId !== songId));
//   };

//   if (!playlistName) return <div>Loading...</div>;

//   return (
//     <div className="p-5 mb-16">
//       <div className='mb-3 flex'><div onClick={() => navigate(-1)}><TiArrowBack size={40} color='white' /></div></div>
//       <form onSubmit={handleUpload} className="flex flex-col gap-4">
//         <h1 className='text-xl text-textcolor font-semibold'>Playlist Name :</h1>
//         <input
//           type="text"
//           placeholder="Enter Playlist Name..."
//           value={playlistName}
//           onChange={(e) => setPlaylistName(e.target.value)}
//           className="p-2 outline-none rounded-lg bg-slate-600 text-white text-lg font-semibold"
//           required
//         />
//         <h1 className='text-xl text-textcolor font-semibold'>Add Songs :</h1>
//         <select
//           value=""
//           onChange={handleSongSelection}
//           className="p-2 outline-none rounded-lg bg-slate-600 text-white text-lg font-semibold"
//         >
//           <option value="" disabled>Select a song to add</option>
//           {availableSongs.map(song => (
//             <option key={song.songId} value={song.songId}>
//               <img src={song.coverImgUrl}/>
//               <span className='mx-2 text-white'>{song.songName} </span>
//               <span className='mx-2 text-white'> ,{song.singer}</span> </option>
//           ))}
//         </select>
//         <div className="flex flex-col gap-2">
//           <h2 className="text-lg text-textcolor font-semibold">Existing Songs:</h2>
//           {selectedSongs.map((song) => (
//             <div key={song.songId} className="flex justify-between items-center bg-slate-700 p-2 rounded-lg">
//               <span className='text-white'><img width={50} src={song.coverImgUrl}/></span>
//               <span className='text-white'>{song.songName}</span>
//               <span className='text-white'>{song.singer}</span>
//               <button
//                 type="button"
//                 onClick={() => handleRemoveSong(song.songId)}
//                 className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//         </div>
//         <h1 className='text-xl text-textcolor font-semibold'>Cover Image :</h1>
//         {coverImgUrl ? (
//           <img src={coverImgUrl} alt="Cover" className="w-full h-48 object-cover rounded-lg" />
//         ) : (
//           <p>No cover image</p>
//         )}
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setCoverImg(e.target.files[0])}
//           className="p-2 outline-none rounded-lg bg-slate-600 text-white text-lg font-semibold"
//         />
//         {uploading && (
//           <div className="mt-2 text-white">
//             Uploading cover image... {Math.round(coverImgProgress)}%
//           </div>
//         )}
//         <button
//           type="submit"
//           disabled={uploading}
//           className="mt-4 p-2 bg-blue-600 text-white text-lg font-bold rounded hover:bg-blue-700"
//         >
//           {uploading ? 'Updating Playlist...' : 'Update Playlist'}
//         </button>
//       </form>
//       <div className="mt-4">
//         <button
//           type="button"
//           onClick={handleDeleteClick}
//           className="p-2 bg-red-600 text-white text-lg font-bold rounded hover:bg-red-700"
//         >
//           Delete Playlist
//         </button>
//         {showConfirmDelete && (
//           <div className="mt-2 bg-gray-800 p-4 rounded">
//             <p className="text-white">Are you sure you want to delete this playlist? This action cannot be undone.</p>
//             <div className="mt-2 flex justify-end gap-2">
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmDelete(false)}
//                 className="p-2 bg-gray-600 text-white text-lg font-bold rounded hover:bg-gray-700"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleDelete}
//                 className="p-2 bg-red-600 text-white text-lg font-bold rounded hover:bg-red-700"
//                 disabled={deleting}
//               >
//                 {deleting ? 'Deleting...' : 'Confirm Delete'}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EditPlaylist;


// =================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../../firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import { TiArrowBack } from "react-icons/ti";
import { MdDelete } from "react-icons/md";

const EditPlaylist = ({ playlistId }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [availableSongs, setAvailableSongs] = useState([]);
  const [coverImg, setCoverImg] = useState(null);
  const [coverImgUrl, setCoverImgUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [coverImgProgress, setCoverImgProgress] = useState(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylistAndSongs = async () => {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const playlists = userData.myplaylists;
        const playlist = playlists.find(playlist => playlist.playlistId === playlistId);

        if (playlist) {
          setPlaylistName(playlist.name);
          setSelectedSongs(playlist.songs.map(song => song.songId)); // Only store song IDs
          setCoverImgUrl(playlist.coverImgUrl);
        }

        // Fetch available songs from 'mysongs'
        const mySongs = userData.mysongs || [];
        setAvailableSongs(mySongs);
      }
    };

    fetchPlaylistAndSongs();
  }, [playlistId, userId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!playlistName || !selectedSongs.length) {
      alert('Playlist name and at least one song are required!');
      return;
    }

    setUploading(true);

    try {
      let updatedCoverImgUrl = coverImgUrl;

      if (coverImg) {
        const timestamp = Date.now();
        const coverImgName = `${userId}_playlist_cover_${timestamp}`;

        // Delete the old cover image if it exists
        if (coverImgUrl) {
          const oldCoverImgRef = ref(storage, coverImgUrl);
          await deleteObject(oldCoverImgRef);
        }

        // Upload the new cover image to Firebase Storage
        const coverImgRef = ref(storage, `playlistCoverImg/${userId}/${coverImgName}`);
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
        const playlists = userDocSnapshot.data().myplaylists;
        const updatedPlaylists = playlists.map(playlist =>
          playlist.playlistId === playlistId
            ? { ...playlist, name: playlistName, songs: availableSongs.filter(song => selectedSongs.includes(song.songId)), coverImgUrl: updatedCoverImgUrl, updatetimestamp: new Date().toISOString() }
            : playlist
        );

        // Update user's document in Firestore with updated playlist info
        await updateDoc(userDocRef, { myplaylists: updatedPlaylists });
      } else {
        console.error('User document does not exist');
      }

      setUploading(false);
      toast.success('Playlist updated successfully', { position: "top-center", toastId: 'update-toast' });
      navigate('/app/myprofile');

    } catch (error) {
      setUploading(false);
      console.error('Error updating playlist:', error);
      alert('Error updating playlist. Please try again.');
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
        const playlists = userDocSnapshot.data().myplaylists;
        const playlistToDelete = playlists.find(playlist => playlist.playlistId === playlistId);

        if (playlistToDelete) {
          // Delete cover image from Firebase Storage if it exists
          if (playlistToDelete.coverImgUrl) {
            const coverImgRef = ref(storage, playlistToDelete.coverImgUrl);
            await deleteObject(coverImgRef);
          }

          // Remove playlist from Firestore
          const updatedPlaylists = playlists.filter(playlist => playlist.playlistId !== playlistId);
          await updateDoc(userDocRef, { myplaylists: updatedPlaylists });

          toast.success('Playlist deleted successfully', { position: "top-center", toastId: 'delete-toast' });
          navigate('/app/myprofile');
        } else {
          console.error('Playlist not found in user document');
        }
      } else {
        console.error('User document does not exist');
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
      alert('Error deleting playlist. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSongChange = (e) => {
    const songId = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      if (!selectedSongs.includes(songId)) {
        setSelectedSongs(prev => [...prev, songId]);
      }
    } else {
      setSelectedSongs(prev => prev.filter(id => id !== songId));
    }
  };

  const handleCoverImgChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImg(e.target.files[0]);
    }
  };

  if (!playlistName) return <div>Loading...</div>;

  return (
    <div className="p-5 mb-16">
      <div className='mb-3 flex'>
        <div onClick={() => navigate(-1)}>
          <TiArrowBack size={40} color='white' />
        </div>
      </div>
      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <h1 className='text-xl text-textcolor font-semibold'>Playlist Name :</h1>
        <input
          type="text"
          placeholder="Enter Playlist Name..."
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          className="p-2 outline-none rounded-lg bg-slate-600 text-white text-lg font-semibold"
          required
        />
        <h1 className='text-xl text-textcolor font-semibold'>Add / Remove Songs :</h1>
        <div className="flex flex-col gap-2">
          {availableSongs.map(song => (
            <div key={song.songId} className="flex items-center gap-2 bg-slate-700 p-2 rounded-lg">
              <input
                type="checkbox"
                value={song.songId}
                checked={selectedSongs.includes(song.songId)}
                onChange={handleSongChange}
                className="accent-blue-500"
              />
              <img src={song.coverImgUrl} alt={song.songName} className="w-10 h-10 object-cover rounded-full" />
              <span className='text-white'>{song.songName}</span>
              <span className='text-white'>, {song.singer}</span>
            </div>
          ))}
        </div>
        <h1 className='text-xl text-textcolor font-semibold'>Cover Image :</h1>
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverImgChange}
          className="p-2 rounded-lg bg-slate-600 text-white"
        />
        {coverImgUrl && !coverImg && (
          <img src={coverImgUrl} alt="Current Cover" className="w-32 h-32 object-cover mt-2" />
        )}
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className={`py-2 px-4 rounded-lg ${uploading ? 'bg-blue-400' : 'bg-blue-500'} text-white`}
            disabled={uploading}
          >
            {uploading ? `Uploading ${coverImgProgress.toFixed(0)}%` : 'Update Playlist'}
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className={`py-2 px-4 rounded-lg ${deleting ? 'bg-red-400' : 'bg-red-500'} text-white`}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Playlist'}
          </button>
        </div>
        {showConfirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg">
              <h2 className="text-lg font-semibold">Are you sure you want to delete this playlist?</h2>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleDelete}
                  className="py-2 px-4 rounded-lg bg-red-500 text-white"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="py-2 px-4 rounded-lg bg-gray-500 text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditPlaylist;


