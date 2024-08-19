import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { useAuth } from "../../Context/AuthContext";
import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase-config";
import BoxLoader from "../Loaders/BoxLoader";

const PopularPlaylist = ({ setPlaylistId }) => {
  const { userId } = useAuth();
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setIsLoading(true);

        // Fetch the user's document
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.exists() ? userDoc.data() : {};

        // Extract followed playlists from the user's data
        const followedPlaylists = new Set(
          (userData.playlists || []).map((playlist) => playlist.playlistId)
        );

        // Fetch all external playlists
        const allPlaylistsSnapshot = await getDocs(collection(db, "playlists"));
        const allPlaylists = allPlaylistsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          playlistId: doc.id,
        }));

        // Filter playlists to exclude the ones the user is following
        const nonFollowedPlaylists = allPlaylists.filter(
          (playlist) => !followedPlaylists.has(playlist.playlistId)
        );

        setFilteredPlaylists(nonFollowedPlaylists);
      } catch (error) {
        console.error("Error fetching playlists: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchPlaylists();
    }
  }, [userId]);

  const handleShowMore = () => {
    setShowAll(!showAll);
  };

  const handlePlaylistClick = (playlistId) => {
    navigate(`/app/playlist?t=externalplaylist&p=${playlistId}`);
  };

  if (isLoading) {
    return <BoxLoader/>;
  }

  if (filteredPlaylists.length === 0) {
    return <div>No popular playlists available.</div>;
  }

  return (
    <div className="md:p-5 max-md:my-5 flex flex-col">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl max-md:text-xl font-semibold text-textcolor">
          Popular Playlists
        </h1>
      </div>
      <div className="flex mt-5 overflow-auto flex-wrap">
        {(showAll ? filteredPlaylists : filteredPlaylists.slice(0, 5)).map(
          (playlist) => (
            <div
              key={playlist.playlistId}
              onClick={() => handlePlaylistClick(playlist.playlistId)}
              className="flex rounded-md border-2 w-48 max-md:w-full items-center cursor-pointer m-1"
            >
              
              <img
                src={playlist.coverImgUrl || "default-cover.jpg"}
                alt={`Cover for playlist ${playlist.name}`}
                className="h-24 w-24 max-md:h-12 max-md:w-12 bg-slate-500 rounded-l-md"
              />
              <h2 className="px-2 text-md font-semibold text-textcolor">
                {playlist.playlistName}
              </h2>
            </div>
          )
        )}
      </div>
      {filteredPlaylists.length > 5 && (
        <div className="w-full flex items-center justify-center mt-5">
          <button
            onClick={handleShowMore}
            className="px-4 py-2 flex items-center justify-center text-textcolor font-semibold rounded-full border-2 border-primarycolor"
          >
            {showAll ? (
              <div className="flex items-center justify-center">
                Show Less <FaAngleUp className="ml-2" />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                Show More <FaAngleDown className="ml-2" />
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default PopularPlaylist;
