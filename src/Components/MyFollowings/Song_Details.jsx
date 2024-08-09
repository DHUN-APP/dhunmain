import React, { useEffect, useState, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { useAuth } from "../../Context/AuthContext";
import MusicPlayer from "./MusicPlayer";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import LocalLoader from "../Loaders/LocalLoader";

const Song_Details = ({ artistId, songId }) => {
  const [song, setSong] = useState(null);
  const [artistData, setArtistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        setIsLoading(true);
        if (!artistId || !songId) {
          console.error("Missing artistId or songId");
          setSong(null);
          setLoading(false);
          return;
        }

        const artistDocRef = doc(db, "artists", artistId);
        const artistDocSnapshot = await getDoc(artistDocRef);

        if (artistDocSnapshot.exists()) {
          const artistData = artistDocSnapshot.data();
          setArtistData(artistData);

          const songDetails = artistData.songs.find(
            (song) => song.songId === songId
          );

          if (songDetails) {
            setSong(songDetails);
          } else {
            console.error("No song details found for the given song ID");
            setSong(null);
          }
        } else {
          console.error("Artist document does not exist");
          setSong(null);
        }
      } catch (error) {
        console.error("Error fetching song details:", error);
        setSong(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongDetails();
  }, [artistId, songId]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  if (isLoading) {
    return <LocalLoader />;
  }

  if (!song) {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="text-2xl font-bold text-red-600 mb-4">
          Song Not Found
        </div>
        <p className="text-lg text-gray-600">
          Sorry, we couldn't find the song you're looking for.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-10">
      <div className="mb-3 flex pl-5">
        <div onClick={() => navigate(-1)}>
          <TiArrowBack size={40} color="white" />
        </div>
      </div>
      <div className="flex w-full max-md:flex-col">
        <div className="w-1/5 md:p-5 flex items-center justify-center max-md:w-full">
          <img
            src={song.coverLink}
            alt={song.songName}
            className="h-48 w-48 rounded-md"
          />
        </div>
        <div className="w-4/5 p-5 max-md:w-full">
          <div className="flex justify-between items-center">
            <div className="text-4xl font-bold flex items-center text-textcolor">
              {song.songName}
            </div>
          </div>
          <h2 className="text-2xl max-md:text-xl my-3 font-semibold text-textcolor">
            By {artistData?.name || "Unknown Artist"}
          </h2>
          <hr className="h-1 my-5 bg-gray-200 border-0 dark:bg-gray-700"></hr>
          <div className="flex items-center text-lg font-semibold text-textcolor">
            Duration:{" "}
            <div className="text-sm font-normal ml-3">
              {duration
                ? `${Math.floor(duration / 60)}:${Math.floor(duration % 60)
                    .toString()
                    .padStart(2, "0")}`
                : "Loading..."}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-5">
        <MusicPlayer
          songFileUrl={song.songLink}
          audioRef={audioRef}
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>
    </div>
  );
};

export default Song_Details;
