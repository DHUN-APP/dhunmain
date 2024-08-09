import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import LocalLoader from "../Loaders/LocalLoader";
import { useAuth } from "../../Context/AuthContext";

const LastGlobalPlaylist = ({ setPlaylistId }) => {
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLastGlobalPlaylist = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const lastGlobalPlaylistId = userData.lastGlobalPlayedPlaylist;

          if (lastGlobalPlaylistId) {
            const playlistDocRef = doc(db, "playlists", lastGlobalPlaylistId);
            const playlistDoc = await getDoc(playlistDocRef);

            if (playlistDoc.exists()) {
              setPlaylist(playlistDoc.data());
            } else {
              console.error("Playlist not found");
            }
          } else {
            console.log("No last global playlist found");
          }
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching last global playlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLastGlobalPlaylist();
  }, [userId]);

  const handlePlaylistClick = (playlistId) => {
    setPlaylistId(playlistId);
    navigate(`/app/globalplaylist`);
  };

  if (isLoading) {
    return <LocalLoader />;
  }

  if (!playlist) {
    return null;
  }

  return (
    <div className="flex flex-col my-10 p-5 w-full">
      <h1 className="text-3xl max-md:text-xl font-semibold text-textcolor mb-5">
        Recently Accessed Playlist
      </h1>
      <div
        onClick={() => handlePlaylistClick(playlist.playlistId)}
        className="flex md:w-1/2 bg-slate-900 items-center border-2 rounded-md p-3"
      >
        <div className=" flex">
          <img
            src={playlist.coverImgUrl || "default-cover.jpg"}
            alt={playlist.name}
            className="h-32 max-md:h-24 w-32 max-md:w-24 rounded-md"
          />
        </div>
        <div className="flex flex-col pl-5">
          <div className="text-4xl max-md:text-xl font-bold flex items-center text-textcolor">
            {playlist.name}
          </div>
          <div className="text-lg md:mt-3 text-textcolor">
            {`Total Songs: ${playlist.songs.length}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastGlobalPlaylist;
