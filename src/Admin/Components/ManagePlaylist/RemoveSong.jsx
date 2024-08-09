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

const RemoveSong = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState("latest");

  useEffect(() => {
    if (selectedPlaylistId) {
      fetchPlaylistDetails();
    }
  }, [selectedPlaylistId]);

  useEffect(() => {
    if (filterType && songs.length > 0) {
      handleFilter(filterType);
    }
  }, [filterType, songs]);

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

  const fetchPlaylistDetails = async () => {
    try {
      const docRef = doc(db, "playlists", selectedPlaylistId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPlaylistName(docSnap.data().name);
        setSongs(docSnap.data().songs || []);
        setSelectedSongs([]);
      } else {
        toast.error("Playlist not found.");
      }
    } catch (error) {
      console.error("Error fetching playlist details:", error);
      toast.error("Error fetching playlist details.");
    }
  };

  const handleSearchTermChange = (event) => {
    setSelectedPlaylistId("");
    setFilterType("latest");
    const term = event.target.value;
    setSearchTerm(term);
    fetchSuggestions(term);
  };

  const handleSuggestionClick = (playlist) => {
    setSelectedPlaylistId(playlist.id);
    setSuggestions([]);
    setSearchTerm(playlist.name);
  };

  const handleSelectSong = (songId) => {
    if (selectedSongs.includes(songId)) {
      setSelectedSongs(selectedSongs.filter((id) => id !== songId));
    } else {
      setSelectedSongs([...selectedSongs, songId]);
    }
  };

  const handleSelectAllSongs = () => {
    if (selectedSongs.length === songs.length) {
      setSelectedSongs([]);
    } else {
      setSelectedSongs(songs.map((song) => song.songId));
    }
  };

  const handleFilter = (type) => {
    let sortedSongs = [...songs];
    if (type === "latest") {
      sortedSongs.sort((a, b) => b.addedOn - a.addedOn);
    } else if (type === "oldest") {
      sortedSongs.sort((a, b) => a.addedOn - b.addedOn);
    } else if (type === "az") {
      sortedSongs.sort((a, b) => a.songId.localeCompare(b.songId));
    } else if (type === "za") {
      sortedSongs.sort((a, b) => b.songId.localeCompare(a.songId));
    }
    setSongs(sortedSongs);
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

      const updatedSongs = songs.filter(
        (song) => !selectedSongs.includes(song.songId)
      );

      const timestamp = new Date();

      await updateDoc(playlistRef, {
        songs: updatedSongs,
        updatedOn: timestamp,
      });

      toast.success("Songs removed successfully!");
      setSelectedSongs([]);
      setSelectedPlaylistId("");
      setSongs([]);
      setSearchTerm("");
    } catch (error) {
      console.error("Error removing songs:", error);
      toast.error("Error removing songs.");
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

          <div className="flex justify-around mb-4">
            <label className="text-textcolor font-bold">
              Filter By:
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 ml-2 bg-primarycolor text-slate-900 font-bold rounded-md"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </select>
            </label>
          </div>

          <div className="flex items-center justify-center mb-4">
            <div
              className="flex bg-slate-400 rounded-md py-3 cursor-pointer"
              onClick={handleSelectAllSongs}
            >
              <input
                className="h-6 w-6 rounded-full mx-3"
                type="checkbox"
                checked={selectedSongs.length === songs.length}
                onChange={handleSelectAllSongs}
                onClick={(e) => e.stopPropagation()}
              />
              <label className="font-bold text-xl pr-3 text-slate-900">
                Select All
              </label>
            </div>
          </div>

          {songs.map((song, index) => (
            <div
              key={index}
              className="mb-4 flex items-center bg-slate-600 rounded-md cursor-pointer"
              onClick={() => handleSelectSong(song.songId)}
            >
              <input
                type="checkbox"
                checked={selectedSongs.includes(song.songId)}
                onChange={() => handleSelectSong(song.songId)}
                className="h-6 w-6 m-3 rounded-full"
                onClick={(e) => e.stopPropagation()}
              />
              <label className=" p-3 w-full text-slate-900 font-bold text-xl bg-slate-400 rounded-r-md">
                {song.songId}
              </label>
            </div>
          ))}

          <button
            type="submit"
            className="mt-5 p-2 bg-primarycolor text-slate-900 font-bold text-xl rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </>
      )}
    </form>
  );
};

export default RemoveSong;
