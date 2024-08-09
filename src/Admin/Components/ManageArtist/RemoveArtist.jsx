import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase-config";
import { toast } from "react-toastify";

const RemoveArtist = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState("");
  const [artistName, setArtistName] = useState("");
  const [artistId, setArtistId] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [artistType, setArtistType] = useState("");
  const [songCount, setSongCount] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (term) => {
    try {
      if (term.length === 0) {
        setSuggestions([]);
        return;
      }

      const q = query(
        collection(db, "artists"),
        where("name", ">=", ""),
        where("name", "<=", "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });

      const filteredResults = results.filter((item) => {
        return item.name.toLowerCase().includes(term.toLowerCase());
      });

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
      console.error("Error fetching suggestions:", error);
      toast.error("Error fetching suggestions.");
    }
  };

  const fetchArtistDetails = async (artistId) => {
    try {
      const docRef = doc(db, "artists", artistId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setArtistName(data.name);
        setArtistId(data.artistId);
        setSongCount(data.songs.length);
        setPhotoURL(data.photoURL);
        setArtistType(data.artistType);
      } else {
        toast.error("Artist not found.");
        navigate("/admin/manageartists");
      }
    } catch (error) {
      console.error("Error fetching artist details:", error);
      toast.error("Error fetching artist details.");
    }
  };

  const handleRemoveArtist = async () => {
    setLoading(true);

    try {
      const docRef = doc(db, "artists", selectedArtistId);
      await deleteDoc(docRef);

      setSearchTerm("");
      setSelectedArtistId("");
      setArtistName("");
      setPhotoURL("");
      setArtistType("");
      toast.success("Artist removed successfully!");
    } catch (error) {
      console.error("Error removing artist:", error);
      toast.error("Error removing artist.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTermChange = (event) => {
    const term = event.target.value;
    setSelectedArtistId("");
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
    <div className="flex flex-col w-[400px] max-md:w-[90%] overflow-y-scroll scrollbar-hide">
      <h2 className="text-xl text-textcolor font-semibold mt-5 mb-2">
        Search Artist by Name:
      </h2>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchTermChange}
        placeholder="Enter artist name"
        className="w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none"
      />
      {suggestions.length > 0 && (
        <ul className="mt-2 max-h-60 overflow-y-auto">
          {suggestions.map((artist) => (
            <li
              key={artist.id}
              onClick={() => handleSuggestionClick(artist)}
              className="p-2 font-bold bg-slate-300 mt-1 cursor-pointer rounded-md hover:bg-slate-400"
            >
              {artist.name}
            </li>
          ))}
        </ul>
      )}

      {selectedArtistId && (
        <>
          <h2 className="text-xl text-textcolor font-semibold mt-5 mb-2">
            Name:
          </h2>
          <p className="w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md">
            {artistName}
          </p>
          <h2 className="text-xl text-textcolor font-semibold mt-5 mb-2">
            Artist ID:
          </h2>
          <p className="w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md">
            {artistId}
          </p>
          <h2 className="text-xl text-textcolor font-semibold mt-5 mb-2">
            Photo URL:
          </h2>
          <p className="w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md">
            {photoURL}
          </p>
          <h2 className="text-xl text-textcolor font-semibold mt-5 mb-2">
            Artist Type:
          </h2>
          <p className="w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md">
            {artistType}
          </p>
          <h2 className="text-xl text-textcolor font-semibold mt-5 mb-2">
            Total Songs:
          </h2>
          <p className="w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md">
            {songCount}
          </p>
          <button
            onClick={handleRemoveArtist}
            className="w-full p-2 flex items-center justify-center bg-red-600 text-xl text-white font-bold rounded-md mt-10"
            disabled={loading}
          >
            {loading ? "Removing..." : "Remove Artist"}
          </button>
        </>
      )}
    </div>
  );
};

export default RemoveArtist;
