import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMusicalNote } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { useAuth } from "../../Context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import LocalLoader from "../Loaders/LocalLoader";

const MySongs = ({ setSongId }) => {
  const { userId } = useAuth();
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true);
        if (userId) {
          const userDocRef = doc(db, "users", userId);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            if (userData.mysongs) {
              setSongs(userData.mysongs);
              setFilteredSongs(userData.mysongs);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching songs: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSongs();
  }, [userId]);

  useEffect(() => {
    const filterSongs = () => {
      const queryLower = searchQuery.toLowerCase();
      const filtered = songs.filter(
        (song) =>
          song.songName.toLowerCase().includes(queryLower) ||
          song.singer.toLowerCase().includes(queryLower)
      );
      setFilteredSongs(filtered);
    };

    filterSongs();
  }, [searchQuery, songs]);

  const handleClick = async (songId) => {
    setSongId(songId);
    navigate("/app/song");

    if (userId) {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        lastPlayed: songId,
      });
    }
  };

  if (isLoading) {
    return <LocalLoader />;
  }

  return (
    <div className="p-5 max-md:p-3 flex flex-col">
      <div className="flex justify-between max-md:flex-col">
        <div className="flex items-center gap-5 max-md:gap-2 text-primarycolor max-md:flex-col">
          <div className="flex items-center justify-center gap-3">
            <IoMusicalNote size={30} />
            <h1 className="text-3xl max-md:text-xl font-semibold text-textcolor">
              My Songs ({filteredSongs.length}/{songs.length})
            </h1>
          </div>
          <div className="ml-5 max-md:ml-3 max-md:my-5 flex items-center justify-center border-primarycolor text-white font-semibold border-b-2">
            <IoIosSearch size={20} />
            <input
              type="text"
              placeholder="Search Song"
              className="outline-none bg-slate-800 px-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div
          onClick={() => navigate("/app/addsong")}
          className="max-md:my-5 flex items-center justify-center text-textcolor font-bold gap-2 py-1 px-3 border-2 rounded-full border-primarycolor max-md:bg-primarycolor max-md:text-slate-900"
        >
          <FaPlus /> New Song
        </div>
      </div>

      <div className="flex space-x-3 mt-10 max-md:mt-3 overflow-auto">
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song, index) => (
            <div
              key={index}
              onClick={() => handleClick(song.songId)}
              className=" flex flex-col rounded-md  border-2 max-w-24 "
            >
              <p className="px-2 text-md font-semibold text-textcolor">
                {song.songName}
              </p>
              <img
                src={song.coverImgUrl}
                alt={song.songName}
                className="h-24 w-24 bg-slate-500"
              />
              <p className="px-2 text-md text-textcolor truncate">
                By {song.singer}
              </p>
            </div>
          ))
        ) : (
          <p className="text-lg font-semibold text-textcolor">No songs found</p>
        )}
      </div>
    </div>
  );
};

export default MySongs;
