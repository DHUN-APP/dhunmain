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

const AddPlaylist = () => {
  const [playlistName, setPlaylistName] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [songs, setSongs] = useState([]);
  const [coverImg, setCoverImg] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [coverImgProgress, setCoverImgProgress] = useState(0);
  const { userId } = useAuth();
  const navigate = useNavigate();

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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!playlistName || !coverImg || selectedSongs.length === 0) {
      alert("All fields are required!");
      return;
    }

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
          timestamp: song.timestamp,
        };
      });

      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        await updateDoc(userDocRef, {
          myplaylists: arrayUnion({
            playlistId,
            name: playlistName,
            coverImgUrl,
            songs: selectedSongsDetails,
            timestamp: new Date().toISOString(),
            updatetimestamp: "",
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
        <div onClick={() => navigate("/app/myprofile")}>
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
        <h1 className="text-xl text-textcolor font-semibold">Select Songs:</h1>
        <div className="flex flex-col gap-2">
          {songs.map((song) => (
            <label
              key={song.songId}
              className="flex items-center gap-2 p-2 cursor-pointer rounded-lg bg-slate-600 text-white"
            >
              <input
                type="checkbox"
                value={song.songId}
                checked={selectedSongs.includes(song.songId)}
                onChange={(e) => handleCheckboxChange(e.target.value)}
                className="mr-2"
              />
              <img
                src={song.coverImgUrl}
                alt={song.songName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div>{song.songName}</div>
                <div className="text-gray-400">{song.singer}</div>
              </div>
            </label>
          ))}
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
