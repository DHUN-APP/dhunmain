


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMusicalNote } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineSort } from "react-icons/md";
import { useAuth } from "../../Context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import LocalLoader from "../Loaders/LocalLoader";


const MySongs = ({ setSongId }) => {
  const { userId } = useAuth();
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("latest");
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
      let filtered = songs.filter(
        (song) =>
          song.songName.toLowerCase().includes(queryLower) ||
          song.singer.toLowerCase().includes(queryLower)
      );

      // Sort songs based on the selected sort option
      switch (sortOption) {
        case "name-a-z":
          filtered = filtered.sort((a, b) => a.songName.localeCompare(b.songName));
          break;
        case "name-z-a":
          filtered = filtered.sort((a, b) => b.songName.localeCompare(a.songName));
          break;
        case "latest":
          filtered = filtered.sort((a, b) => new Date(b.updatedOn) - new Date(a.updatedOn));
          break;
        case "oldest":
          filtered = filtered.sort((a, b) => new Date(a.updatedOn) - new Date(b.updatedOn));
          break;
        default:
          break;
      }

      setFilteredSongs(filtered);
    };

    filterSongs();
  }, [searchQuery, sortOption, songs]);

  const handleClick = async (songId) => {
    setSongId(songId);
    navigate(`/app/songdetails?t=m&s=${songId}`);

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

        <div className="flex items-center gap-5 max-md:gap-2 text-textcolor max-md:flex-col">

          <div className="flex items-center justify-center gap-3">
            <IoMusicalNote size={30} />
            <h1 className="text-3xl max-md:text-xl font-semibold text-textcolor">
              My Songs ({filteredSongs.length}/{songs.length})
            </h1>
          </div>

          <div className="flex space-x-4">
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

            <div className="flex text-white items-center space-x-2 outline-none">
              <div className="text-xl"><MdOutlineSort /></div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="p-1 bg-slate-600 rounded-full outline-none"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="name-a-z">Name (A-Z)</option>
                <option value="name-z-a">Name (Z-A)</option>
              </select>
            </div>
          </div>

        </div>
        <div
          onClick={() => navigate("/app/addsong")}
          className="cursor-pointer max-md:my-5 flex items-center justify-center text-textcolor font-bold gap-2 py-1 px-3 border-2 rounded-full border-primarycolor max-md:bg-primarycolor max-md:text-slate-900"
        >
          <FaPlus /> New Song
        </div>
      </div>

      <div className="flex justify-between items-center mt-5">

      </div>

      <div className="flex md:mt-10 flex-wrap max-md:h-52 max-md:overflow-x-scroll max-md:border-2 max-md:p-2 max-md:rounded-lg">
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song, index) => (
            <div
              key={index}
              onClick={() => handleClick(song.songId)}
              className="flex bg-slate-700 rounded-xl p-2 md:mx-1 my-1 w-48 cursor-pointer max-md:w-full h-fit"
            >
                <img
                  src={song.coverImgUrl}
                  alt={song.songName}
                  className="h-16 w-16 rounded-md bg-slate-500"
                />
              <div className="px-2 text-white w-full overflow-hidden">
                <h2 className="text-xl w-full font-semibold truncate">{song.songName}</h2>
                <h2 className="text-md w-full truncate">{song.singer}</h2>
              </div>
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
