import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import LocalLoader from "../Loaders/LocalLoader";
import { TbPlaylist } from "react-icons/tb";
import { IoMusicalNote } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";
import { GoInfo } from "react-icons/go";

const MyInfo = () => {
  const { user, userId } = useAuth();
  const [firestoreUser, setFirestoreUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getFirestoreData = async () => {
      try {
        setIsLoading(true);
        const q = query(collection(db, "users"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setFirestoreUser(doc.data());
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) {
      getFirestoreData();
    }
  }, [userId]);

  const convertTimestampToDate = (timestamp) => {
    const date = new Date(timestamp);

    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });

    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const ordinalSuffix = getOrdinalSuffix(day);
    return `${day}${ordinalSuffix} ${month}, ${year}`;
  };

  if (isLoading) {
    return <LocalLoader />;
  }
  if (!firestoreUser) {
    return <div>No user data found</div>;
  }

  const followingsCount = firestoreUser.artists? firestoreUser.artists.length : 0;
  const songsCount = firestoreUser.mysongs ? firestoreUser.mysongs.length : 0;
  const myPlaylistsCount = firestoreUser.myplaylists ? firestoreUser.myplaylists.length : 0;
  const followedPlaylistsCount = firestoreUser.playlists ? firestoreUser.playlists.length : 0;
    
  return (
    <div className="flex w-full p-5">
      {user && (
        <div className="w-full flex max-md:flex-col max-md:items-center">

          <div className="md:w-1/4 flex justify-center items-center">
              <img
                src={firestoreUser.photoURL}
                alt=""
                className="h-40 w-40 rounded-full object-cover border-4 border-white"
              />
          </div>

          <div className="w-full flex flex-col justify-center">
            <div className="flex justify-between items-center max-md:mt-5 ">
              <div className="text-4xl max-md:text-3xl font-bold flex items-center text-textcolor ">
                {firestoreUser.name}
              </div>
              <div
                onClick={() => navigate("/app/editinfo")}
                className="flex items-center justify-center px-6 max-md:px-3 text-lg font-semibold py-2 max-md:py-1 bg-slate-300 gap-2 max-md:gap-1 rounded-full"
              >
                <MdEdit size={20} />
                Edit
              </div>
            </div>

            <div className="text-lg text-textcolor font-semibold mt-3">
              <div className="flex items-center space-x-5"><IoMusicalNote/><h1>Songs: {songsCount}</h1></div>
              <div className="flex items-center space-x-5"><TbPlaylist/><h1>Playlists: {myPlaylistsCount+followedPlaylistsCount} (Own: {myPlaylistsCount}, Followed: {followedPlaylistsCount})</h1></div>
              <div className="flex items-center space-x-5"><IoPerson/><h1>Followings: {followingsCount}</h1></div>
              <div className="flex items-center space-x-5"><GoInfo/><h1>Joined: {convertTimestampToDate(firestoreUser.createdOn)}</h1></div>
            </div>
            
          </div>

        </div>
      )}
    </div>
  );
};

export default MyInfo;
