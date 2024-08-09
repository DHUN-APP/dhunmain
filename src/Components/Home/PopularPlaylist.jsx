import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMusicalNote } from "react-icons/io5";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { useAuth } from "../../Context/AuthContext";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase-config";

const PopularPlaylist = ({ setPlaylistId }) => {
  const { userId } = useAuth();
  const [allPlaylists, setAllPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setIsLoading(true);
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.exists() ? userDoc.data() : {};
        const followedPlaylistIds = new Set(userData.playlists || []);

        const allPlaylistsSnapshot = await getDocs(collection(db, "playlists"));
        const allPlaylists = allPlaylistsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          playlistId: doc.id,
        }));

        const nonFollowedPlaylists = allPlaylists.filter(
          (playlist) => !followedPlaylistIds.has(playlist.playlistId)
        );

        setAllPlaylists(allPlaylists);
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
    setPlaylistId(playlistId);
    navigate(`/app/globalplaylist`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (filteredPlaylists.length === 0) {
    return null;
  }

  return (
    <div className="p-5 max-md:p-3 flex flex-col">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl max-md:text-xl font-semibold text-textcolor">
          Popular Playlists
        </h1>
      </div>
      <div className="flex space-x-3 mt-5 overflow-auto flex-wrap">
        {(showAll ? filteredPlaylists : filteredPlaylists.slice(0, 5)).map(
          (playlist) => (
            <div
              key={playlist.playlistId}
              onClick={() => handlePlaylistClick(playlist.playlistId)}
              className="flex flex-col rounded-md border-2 max-w-24 cursor-pointer mt-3"
            >
              <p className="px-2 text-md font-semibold text-textcolor">
                {playlist.name}
              </p>
              <img
                src={playlist.coverImgUrl || "default-cover.jpg"}
                alt={`Cover for playlist ${playlist.name}`}
                className="h-24 w-24 bg-slate-500"
              />
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
