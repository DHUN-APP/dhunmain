import React, { useState, useEffect } from "react";
import { storage, db } from "../../../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  updateDoc,
  arrayUnion,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import { IoIosSearch } from "react-icons/io";

const AddPlaylist = () => {
  const [playlistName, setPlaylistName] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [songs, setSongs] = useState([]);
  const [coverImg, setCoverImg] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [coverImgProgress, setCoverImgProgress] = useState(0);
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const songsArray = userData.mysongs || [];
          setSongs(songsArray);
        } else {
          console.error("User document does not exist");
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };
    fetchSongs();
  }, [userId]);

  useEffect(() => {
    const filterSongs = () => {
      const queryLower = searchQuery.toLowerCase();
      let filtered = songs.filter(
        (song) =>
          song.songName.toLowerCase().includes(queryLower) ||
          song.singer.toLowerCase().includes(queryLower)
      );
      setFilteredSongs(filtered);
    };

    filterSongs();
  }, [searchQuery,songs]);

  const handleUpload = async (e) => {
    e.preventDefault();

    setUploading(true);

    try {
      const timestamp = Date.now();
      const coverImgName = `${userId}_playlist_cover_${timestamp}`;
      const playlistId = `${userId}_${timestamp}`;

      const coverImgRef = ref(
        storage,
        `playlistCoverImg/${userId}/${coverImgName}`
      );
      const coverImgUploadTask = uploadBytesResumable(coverImgRef, coverImg);
      coverImgUploadTask.on("state_changed", (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setCoverImgProgress(progress);
      });

      await coverImgUploadTask;
      const coverImgUrl = await getDownloadURL(coverImgRef);

      const selectedSongsDetails = selectedSongs.map((songId) => {
        const song = songs.find((song) => song.songId === songId);
        return {
          songId: song.songId,
          addedOn: new Date().toISOString() 
        };
      });

      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        await updateDoc(userDocRef, {
          myplaylists: arrayUnion({
            playlistId,
            playlistName: playlistName,
            coverImgUrl,
            songs: selectedSongsDetails,
            createdOn: new Date().toISOString(),
            updatedOn: new Date().toISOString(),
            followers:0,
            views:0
          }),
        });
      } else {
        console.error("User document does not exist");
      }

      setUploading(false);
      toast.success("Playlist added successfully", {
        position: "top-center",
        toastId: "playlist-toast",
      });
      setPlaylistName("");
      setCoverImg(null);
      setSelectedSongs([]);
      setCoverImgProgress(0);

      navigate("/app/myprofile");
    } catch (error) {
      setUploading(false);
      console.error("Error adding playlist:", error);
      alert("Error adding playlist. Please try again.");
    }
  };

  const handleCheckboxChange = (songId) => {
    setSelectedSongs((prevSelectedSongs) =>
      prevSelectedSongs.includes(songId)
        ? prevSelectedSongs.filter((id) => id !== songId)
        : [...prevSelectedSongs, songId]
    );
  };

  return (
    <div className="p-5">
      <div className="mb-3 flex">
        <div onClick={() => navigate(-1)}>
          <TiArrowBack size={40} color="white" />
        </div>
      </div>
      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <h1 className="text-xl text-textcolor font-semibold">Playlist Name:</h1>
        <input
          type="text"
          placeholder="Enter Playlist Name..."
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          className="p-2 outline-none rounded-lg bg-slate-600 text-white text-lg font-semibold"
          required
        />
        <h1 className="text-xl text-textcolor font-semibold">
          Upload Cover Image:
        </h1>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverImg(e.target.files[0])}
          className="p-2 outline-none rounded-lg bg-slate-600 text-white text-lg font-semibold"
          required
        />
        {uploading && (
          <div className="flex items-center">
            <progress
              value={coverImgProgress}
              max="100"
              className="rounded-lg overflow-hidden"
            />
            <span className="ml-2 text-lg text-textcolor font-medium">
              ({coverImgProgress.toFixed(2)}%) Uploaded
            </span>
          </div>
        )}
        <div className="flex items-center space-x-8 md:my-2">
          <h1 className="text-xl text-textcolor font-semibold">Select Songs ({selectedSongs.length}) :</h1>
          <div className="ml-5 max-md:ml-3 max-md:my-5 flex items-center justify-center border-primarycolor text-white font-semibold border-b-2">
                <IoIosSearch size={20} />
                <input
                  type="text"
                  placeholder="Search Song"
                  className="outline-none bg-slate-800 max-md:bg-primarybg px-1 max-md:w-36"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
          </div>
        </div>
        <div className="flex flex-wrap max-md:h-48 max-md:overflow-x-scroll max-md:border-2 max-md:p-1">
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song,index) => (
            <label
              key={song.songId}
              className="flex h-fit items-center cursor-pointer rounded-lg bg-slate-600 text-white w-48 max-md:w-full overflow-hidden p-2 m-1 space-x-2"
            >
              <input
                type="checkbox"
                value={song.songId}
                checked={selectedSongs.includes(song.songId)}
                onChange={(e) => handleCheckboxChange(e.target.value)}
              />
              <img
                src={song.coverImgUrl}
                alt={song.songName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col overflow-hidden">
                <div className="text-lg truncate font-semibold">{song.songName}</div>
                <div className=" truncate text-sm">{song.singer}</div>
              </div>
            </label>
          )))

         : (<p className="text-lg font-semibold text-textcolor">No songs found</p>)
         }
          
        </div>
        <button
          type="submit"
          className="p-2 bg-slate-300 mt-4 text-slate-900 text-lg font-bold rounded"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Add Playlist"}
        </button>
      </form>
    </div>
  );
};

export default AddPlaylist;
