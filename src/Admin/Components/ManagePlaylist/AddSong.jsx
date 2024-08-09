import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase-config";
import { toast } from "react-toastify";

const AddSong = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [songIds, setSongIds] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedPlaylistId) {
      fetchPlaylistName();
    }
  }, [selectedPlaylistId]);

  const fetchSuggestions = async (term) => {
    try {
      if (term.length === 0) {
        setSuggestions([]);
        return;
      }

      const q = query(
        collection(db, "playlists"),
        where("name", ">=", term),
        where("name", "<=", term + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setSuggestions(results);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast.error("Error fetching suggestions.");
    }
  };

  const fetchPlaylistName = async () => {
    try {
      const docRef = doc(db, "playlists", selectedPlaylistId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPlaylistName(docSnap.data().name);
      } else {
        toast.error("Playlist not found.");
      }
    } catch (error) {
      console.error("Error fetching playlist name:", error);
      toast.error("Error fetching playlist name.");
    }
  };

  const handleSearchTermChange = (event) => {
    setSelectedPlaylistId("");
    setSongIds([""]);
    const term = event.target.value;
    setSearchTerm(term);
    fetchSuggestions(term);
  };

  const handleSuggestionClick = (playlist) => {
    setSelectedPlaylistId(playlist.id);
    setSuggestions([]);
    setSearchTerm(playlist.name);
  };

  const handleAddSongId = () => {
    setSongIds([...songIds, ""]);
  };

  const handleSongIdChange = (index, value) => {
    const updatedSongIds = [...songIds];
    updatedSongIds[index] = value;
    setSongIds(updatedSongIds);
  };

  const handleDeleteSongId = (index) => {
    const updatedSongIds = songIds.filter((_, i) => i !== index);
    setSongIds(updatedSongIds);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const playlistRef = doc(db, "playlists", selectedPlaylistId);
      const playlistDoc = await getDoc(playlistRef);

      if (!playlistDoc.exists()) {
        toast.error("Playlist not found.");
        setIsLoading(false);
        return;
      }

      const existingSongs = playlistDoc.data().songs || [];

      const existingSongIdMap = new Map();
      existingSongs.forEach((song) => existingSongIdMap.set(song.songId, true));

      const newSongIdMap = new Map();
      const duplicateWithinNewSongs = [];
      songIds.forEach((songId, index) => {
        if (newSongIdMap.has(songId)) {
          duplicateWithinNewSongs.push(
            `Song ID ${songId} is duplicated in the submission.`
          );
        }
        newSongIdMap.set(songId, true);
      });

      const duplicates = [];
      songIds.forEach((songId) => {
        if (existingSongIdMap.has(songId)) {
          duplicates.push(`Song ID ${songId} already exists in the playlist.`);
        }
      });

      if (duplicates.length > 0) {
        duplicates.forEach((msg) => toast.error(msg));
      }

      if (duplicateWithinNewSongs.length > 0) {
        duplicateWithinNewSongs.forEach((msg) => toast.error(msg));
      }

      if (duplicates.length > 0 || duplicateWithinNewSongs.length > 0) {
        setIsLoading(false);
        return;
      }

      const timestamp = new Date();
      const updatedSongs = [
        ...existingSongs,
        ...songIds.map((id) => ({ songId: id, addedOn: timestamp })),
      ];

      await updateDoc(playlistRef, {
        songs: updatedSongs,
        updatedOn: timestamp,
      });

      toast.success("Songs added successfully!");
      setSongIds([""]);
      setSelectedPlaylistId("");
    } catch (error) {
      console.error("Error adding songs:", error);
      toast.error("Error adding songs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col w-[400px] max-md:w-[90%]"
      onSubmit={handleSubmit}
    >
      <h2 className=" text-xl text-textcolor font-semibold mt-5 mb-2">
        Select Playlist:
      </h2>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchTermChange}
        placeholder="Enter playlist name"
        className="w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none"
        required
      />
      {suggestions.length > 0 && (
        <ul className="mt-2 max-h-60 overflow-y-auto">
          {suggestions.map((playlist) => (
            <li
              key={playlist.id}
              onClick={() => handleSuggestionClick(playlist)}
              className="p-2 font-bold bg-slate-300 mt-1 cursor-pointer rounded-md hover:bg-slate-400"
            >
              {playlist.name}
            </li>
          ))}
        </ul>
      )}

      {selectedPlaylistId && (
        <>
          <div className="flex items-center justify-center my-5">
            <h2 className="border-2 border-primarycolor rounded-md text-xl text-textcolor font-semibold py-2 px-5">
              {playlistName}
            </h2>
          </div>

          {songIds.map((songId, index) => (
            <div
              key={index}
              className="mb-4 flex items-center justify-center gap-3"
            >
              <h2 className="text-xl text-textcolor font-semibold text-nowrap">
                Song : {index + 1}
              </h2>
              <input
                type="text"
                value={songId}
                onChange={(e) => handleSongIdChange(index, e.target.value)}
                placeholder="Song ID"
                className="w-full p-2 bg-slate-600 text-lg text-white font-semibold outline-none rounded-md"
                required
              />
              <button
                onClick={() => handleDeleteSongId(index)}
                className="p-2 bg-red-600 text-white font-semibold rounded-md"
                type="button"
              >
                Delete
              </button>
            </div>
          ))}

          <button
            onClick={handleAddSongId}
            className="mt-2 p-2 bg-primarycolor text-slate-900 font-bold text-xl rounded-md"
            type="button"
          >
            Add Another Song ID
          </button>

          <button
            type="submit"
            className="mt-5 p-2 bg-primarycolor text-slate-900 font-bold text-xl rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </>
      )}
    </form>
  );
};

export default AddSong;
