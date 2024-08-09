import React, { useEffect, useState, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { MdRecentActors } from "react-icons/md";

const Sidebar = ({ setSongId }) => {
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const mySongs = userData.mysongs || [];

          const songId = userData.lastPlayed;
          if (songId) {
            const songDetails = mySongs.find((song) => song.songId === songId);
            setSong(songDetails);
            console.log(songId);
          } else {
            console.error("No song ID provided and no last played song found");
          }
        } else {
          console.error("User document does not exist");
        }
      } catch (error) {
        console.error("Error fetching song details:", error);
      }
    };
    fetchSongDetails();
  }, [userId]);

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

  return (
    <div className=" h-screen flex flex-col items-center cursor-pointer">
      <ul className="h-screen text-xl text-white font-semibold w-full flex flex-col justify-between">
        <li className="bg-slate-800 rounded-lg h-[20%] mt-4 mx-4 flex flex-col justify-evenly items-center pl-6">
          <div
            onClick={() => navigate("/app/home")}
            className="flex items-center gap-3 w-full"
          >
            <IoHome size={30} />
            Home
          </div>
          <div
            onClick={() => navigate("/app/myprofile")}
            className="flex items-center gap-3 w-full"
          >
            <MdAccountCircle size={30} /> My Profile
          </div>
        </li>
        <li className="h-[70%] bg-slate-800 m-4 rounded-lg pl-6 flex flex-col py-3">
          <div className="flex gap-3">
            <MdRecentActors size={30} />
            Recents...
          </div>
          {song && (
            <div
              onClick={() => handleClick(song.songId)}
              className="w-full flex my-5 overflow-auto"
            >
              <div className="flex flex-wrap items-center justify-center bg-slate-500 p-2 rounded-l-lg">
                <img
                  src={song.coverImgUrl}
                  alt={song.songName}
                  className="h-16 w-16 rounded-md"
                />
              </div>
              <div className="flex flex-col px-5  justify-center rounded-r-lg bg-slate-500">
                <div className="text-slate-900 text-xl font-semibold">
                  {song.songName}
                </div>
                <div className="text-slate-900 text-sm font-semibold">
                  By {song.singer}
                </div>
              </div>
            </div>
          )}
        </li>
        <li
          onClick={() => navigate("/app/settings")}
          className="h-[10%] flex items-center bg-slate-800 rounded-lg mb-4 mx-4 pl-6 gap-3"
        >
          <IoMdSettings size={30} /> Settings
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
