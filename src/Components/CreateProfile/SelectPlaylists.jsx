import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { db } from "../../../firebase-config";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import UniversalLoader from "../Loaders/UniversalLoader";
import { UisCheckCircle } from "@iconscout/react-unicons-solid";
import { UilArrowRight } from "@iconscout/react-unicons";
import { toast } from "react-toastify";

const SelectPlaylists = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const playlistsSnapshot = await getDocs(collection(db, "playlists"));
        const playlistData = playlistsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlaylists(playlistData);
      } catch (error) {
        console.error("Error fetching playlist data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePlaylistSelect = (playlistId) => {
    setSelectedPlaylists((prevSelected) =>
      prevSelected.includes(playlistId)
        ? prevSelected.filter((id) => id !== playlistId)
        : [...prevSelected, playlistId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPlaylists.length < 3) {
      toast.error("Select at least 3 playlists!", {
        position: "top-center",
        toastId: "welcome-toast",
      });
      return;
    }
    try {
      setIsLoading(true);
      const userDocRef = doc(db, "users", userId);
      await setDoc(
        userDocRef,
        {
          playlists: selectedPlaylists,
        },
        { merge: true }
      );
      navigate("/createprofile/plan");
    } catch (error) {
      console.error("Error saving playlists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <UniversalLoader />;
  }

  return (
    <div className="w-full h-screen flex flex-col items-center overflow-y-scroll scrollbar-hide">
      <h1 className="text-3xl max-md:text-xl max-md:border-2 max-md:px-5 max-md:mb-6 text-textcolor font-bold mt-14 mb-8 border-4 border-primarycolor px-10 flex justify-center rounded-full py-2">
        Select Your Favorite Playlists
      </h1>
      <ul className="w-full flex flex-wrap justify-center mb-[150px]">
        {playlists.map((playlist) => (
          <li
            key={playlist.id}
            className={`shadow-lg shadow-black border-2 rounded-xl m-3 h-[310px] max-md:h-[240px] w-[200px] max-md:w-[150px] flex flex-col text-center cursor-pointer transition-colors duration-300 ease-in-out ${
              selectedPlaylists.includes(playlist.id)
                ? "bg-highlight"
                : "bg-transparent"
            }`}
            onClick={() => handlePlaylistSelect(playlist.id)}
          >
            <div className="h-[15%] w-full flex items-center rounded-t-xl px-2 py-1">
              <div
                className={`flex w-full justify-end ${
                  selectedPlaylists.includes(playlist.id) ? "" : "hidden"
                }`}
              >
                <UisCheckCircle size={30} color="white" />
              </div>
            </div>
            <div className="h-[65%]">
              <img
                src={playlist.coverImgUrl}
                alt={playlist.name}
                className="h-[200px] w-[200px] max-md:h-[150px] max-md:w-[150px]"
              />
            </div>
            <p className="text-textcolor rounded-b-xl h-[20%] items-center max-md:text-sm text-md font-semibold w-full flex p-2 justify-center">
              {playlist.name}
            </p>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubmit}
        className="text-xl flex bg-primarycolor py-2 px-5 rounded-full font-bold my-14 absolute bottom-0 shadow-md shadow-black"
      >
        Next
        <UilArrowRight size={30} color="black" />
      </button>
    </div>
  );
};

export default SelectPlaylists;
