import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { TiArrowBack } from "react-icons/ti";
import LocalLoader from "../Loaders/LocalLoader";

const PlaylistDetails = ({ playlistId, setSongId }) => {
  const [playlist, setPlaylist] = useState(null);
  const [songsDetails, setSongsDetails] = useState([]);
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        setIsLoading(true);
        const userDocRef = doc(db, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const myPlaylists = userData.myplaylists || [];
          const mySongs = userData.mysongs || [];

          const playlistDetails = myPlaylists.find(
            (playlist) => playlist.playlistId === playlistId
          );

          if (playlistDetails) {
            setPlaylist(playlistDetails);

            const songsMap = mySongs.reduce((map, song) => {
              map[song.songId] = song;
              return map;
            }, {});

            const playlistSongsDetails = playlistDetails.songs
              .map((song) => songsMap[song.songId])
              .filter((song) => song !== undefined);
            setSongsDetails(playlistSongsDetails);
          } else {
            console.error("Playlist not found");
          }
        } else {
          console.error("User document does not exist");
        }
      } catch (error) {
        console.error("Error fetching playlist details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylistDetails();
  }, [playlistId, userId]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <LocalLoader />;
  }

  if (!playlist) {
    return <div>Playlist not found</div>;
  }

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
    <div className="flex flex-col mt-10 px-5 mb-16">
      <div className="mb-3 flex">
        <div onClick={() => navigate(-1)}>
          <TiArrowBack size={40} color="white" />
        </div>
      </div>

      <div className="flex w-full max-md:flex-col">
        <div className="w-1/5 md:p-5 flex items-center justify-center max-md:w-full">
          <img
            src={playlist.coverImgUrl}
            alt={playlist.name}
            className="h-48 w-48 rounded-md"
          />
        </div>
        <div className="w-4/5 p-5 max-md:w-full">
          <div className="flex justify-between items-center">
            <div className="text-4xl font-bold flex items-center text-textcolor">
              {playlist.name}
            </div>
            <div
              onClick={() => navigate("/app/editplaylist")}
              className="flex items-center justify-center px-6 max-md:px-3 text-lg font-semibold py-2 max-md:py-1 bg-slate-300 gap-2 max-md:gap-1 rounded-full"
            >
              <MdEdit size={20} />
              Edit
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl max-md:text-xl my-3 font-semibold text-textcolor">
        Songs:
      </h2>
      {songsDetails.map((song, index) => (
        <div
          key={index}
          onClick={() => handleClick(song.songId)}
          className="my-2 flex items-center border-2 rounded-md p-2"
        >
          <img
            src={song.coverImgUrl}
            alt={song.songName}
            className="h-16 w-16 rounded-md"
          />
          <div className="ml-3 flex flex-col">
            <div className="text-lg font-semibold text-textcolor">
              {song.songName}
            </div>
            <div className="text-md font-semibold text-textcolor">
              By: {song.singer}
            </div>
            <div className="text-md font-semibold text-textcolor">
              Uploaded On: {formatTimestamp(song.timestamp)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaylistDetails;
