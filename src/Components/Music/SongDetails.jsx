import React, { useEffect, useState, useRef } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  runTransaction,
} from "firebase/firestore";
import { db } from "../../../firebase-config";
import { useAuth } from "../../Context/AuthContext";
import MusicPlayer from "../Music/MusicPlayer";
import { TiArrowBack } from "react-icons/ti";
import { IoMdShareAlt } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import LocalLoader from "../Loaders/LocalLoader";
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import Share from "../Share/Share";

import { MdOutlineRemoveRedEye } from "react-icons/md";
import {} from "react-icons/bi";

const SongDetails = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const songType = queryParams.get("t");
  const artistId = queryParams.get("a");
  const songId = queryParams.get("s");
  const [song, setSong] = useState(null);
  const [artistData, setArtistData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth(); // assuming useAuth provides userId
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        setIsLoading(true);

        if (songType === "m") {
          const userDocRef = doc(db, "users", userId);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const mySongs = userData.mysongs || [];

            const effectiveSongId = songId || userData.lastPlayed;

            if (effectiveSongId) {
              const songDetails = mySongs.find(
                (song) => song.songId === effectiveSongId
              );
              setSong(songDetails);
            } else {
              console.error(
                "No song ID provided and no last played song found"
              );
            }
          } else {
            console.error("User document does not exist");
          }
        }

        if (songType === "a") {
          if (!artistId || !songId) {
            console.error("Missing artistId or songId");
            setSong(null);
            setLoading(false);
            return;
          }

          const artistDocRef = doc(db, "artists", artistId);
          const artistDocSnapshot = await getDoc(artistDocRef);

          const userDocRef = doc(db, "users", userId);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserData(userData);
          } else {
            setUserData({ likes: [], dislikes: [] });
          }

          if (artistDocSnapshot.exists()) {
            const artistData = artistDocSnapshot.data();
            setArtistData(artistData);

            const songDetails = artistData.songs.find(
              (song) => song.songId === songId
            );

            if (songDetails) {
              setSong(songDetails);

              const songRef = doc(db, "artists", artistId);
              const updatedSongs = artistData.songs.map((song) =>
                song.songId === songId
                  ? { ...song, views: (song.views || 0) + 1 }
                  : song
              );
              await updateDoc(songRef, { songs: updatedSongs });
            } else {
              console.error("No song details found for the given song ID");
              setSong(null);
            }
          } else {
            console.error("Artist document does not exist");
            setSong(null);
          }
        }
      } catch (error) {
        console.error("Error fetching song details:", error);
        setSong(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongDetails();
  }, [artistId, songId, userId]);

  useEffect(() => {
    if (songType === "a") {
      if (song && userData) {
        setIsLiked(userData.likes.includes(song.songId));
        setIsDisliked(userData.dislikes.includes(song.songId));
      }
    }
  }, [song, userData]);



  const handleLike = async () => {
    const artistDocRef = doc(db, "artists", artistId);
    const userDocRef = doc(db, "users", userId);

    try {
      setIsLikeLoading(true);
      await runTransaction(db, async (transaction) => {
        const artistDoc = await transaction.get(artistDocRef);
        const userDoc = await transaction.get(userDocRef);

        if (!artistDoc.exists() || !userDoc.exists()) {
          throw new Error("Artist or User document not found");
        }

        const artistData = artistDoc.data();
        const userData = userDoc.data();

        // Find the song
        const updatedSongs = [...artistData.songs];
        const songIndex = updatedSongs.findIndex(
          (song) => song.songId === songId
        );

        if (songIndex === -1) {
          throw new Error("Song not found in artist's songs array");
        }

        // Remove from dislikes if present
        if (isDisliked) {
          transaction.update(userDocRef, {
            dislikes: arrayRemove(songId),
          });
          // updatedSongs[songIndex].dislikes = updatedSongs[songIndex].dislikes.filter((id) => id !== userId);
          updatedSongs[songIndex].dislikes = updatedSongs[songIndex].dislikes-1;
          setIsDisliked(false);
        }

        // Toggle like
        if (!isLiked) {
          transaction.update(userDocRef, {
            likes: arrayUnion(songId),
          });
          // updatedSongs[songIndex].likes.push(userId);
          updatedSongs[songIndex].likes=updatedSongs[songIndex].likes+1;
          setIsLiked(true);
        } else {
          transaction.update(userDocRef, {
            likes: arrayRemove(songId),
          });
          // updatedSongs[songIndex].likes = updatedSongs[songIndex].likes.filter((id) => id !== userId);
          updatedSongs[songIndex].likes = updatedSongs[songIndex].likes-1;
          setIsLiked(false);
        }

        // Update the entire songs array in the artist document
        transaction.update(artistDocRef, {
          songs: updatedSongs,
        });
      });

      const updatedArtistDoc = await getDoc(artistDocRef);
    } catch (error) {
      console.error("Error handling like in transaction:", error);
    } finally {
      setIsLikeLoading(false);
    }
  };



  const handleDislike = async () => {
    const artistDocRef = doc(db, "artists", artistId);
    const userDocRef = doc(db, "users", userId);

    try {
      setIsLikeLoading(true);
      await runTransaction(db, async (transaction) => {
        const artistDoc = await transaction.get(artistDocRef);
        const userDoc = await transaction.get(userDocRef);

        if (!artistDoc.exists() || !userDoc.exists()) {
          throw new Error("Artist or User document not found");
        }

        const artistData = artistDoc.data();
        const userData = userDoc.data();

        // Find the song
        const updatedSongs = [...artistData.songs];
        const songIndex = updatedSongs.findIndex(
          (song) => song.songId === songId
        );

        if (songIndex === -1) {
          throw new Error("Song not found in artist's songs array");
        }

        // Remove from likes if present
        if (isLiked) {
          transaction.update(userDocRef, {
            likes: arrayRemove(songId),
          });
          // updatedSongs[songIndex].likes = updatedSongs[songIndex].likes.filter((id) => id !== userId);
          updatedSongs[songIndex].likes = updatedSongs[songIndex].likes-1;
          setIsLiked(false);
        }

        // Toggle dislike
        if (!isDisliked) {
          transaction.update(userDocRef, {
            dislikes: arrayUnion(songId),
          });
          // updatedSongs[songIndex].dislikes.push(userId);
          updatedSongs[songIndex].dislikes=updatedSongs[songIndex].dislikes+1;
          setIsDisliked(true);
        } else {
          transaction.update(userDocRef, {
            dislikes: arrayRemove(songId),
          });
          // updatedSongs[songIndex].dislikes = updatedSongs[songIndex].dislikes.filter((id) => id !== userId);
          updatedSongs[songIndex].dislikes = updatedSongs[songIndex].dislikes-1;
          setIsDisliked(false);
        }

        // Update the entire songs array in the artist document
        transaction.update(artistDocRef, {
          songs: updatedSongs,
        });
      });

      const updatedArtistDoc = await getDoc(artistDocRef);
    } catch (error) {
      console.error("Error handling dislike in transaction:", error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  

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

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handelShareClick = async () => {
    setIsShareModalOpen(true);
    try {
      const artistDocRef = doc(db, "artists", artistId);

      await runTransaction(db, async (transaction) => {
        const artistDoc = await transaction.get(artistDocRef);

        if (!artistDoc.exists()) {
          throw new Error("Artist document not found");
        }

        const artistData = artistDoc.data();
        const updatedSongs = [...artistData.songs];
        const songIndex = updatedSongs.findIndex(
          (song) => song.songId === songId
        );

        if (songIndex === -1) {
          throw new Error("Song not found in artist's songs array");
        }

        // Increment the shares field
        updatedSongs[songIndex].shares =
          (updatedSongs[songIndex].shares || 0) + 1;

        // Update the artist document with the incremented shares field
        transaction.update(artistDocRef, {
          songs: updatedSongs,
        });
      });
    } catch (error) {
      console.error("Error incrementing shares count:", error);
    }
  };

  const handleSongClick = (songId) => {
    navigate(`/app/editsong?s=${songId}`);
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
    <div className="flex flex-col mt-10 max-md:mt-5">
      <div className="mb-3 flex pl-5">
        <div onClick={() => navigate(-1)}>
          <TiArrowBack size={40} color="white" />
        </div>
      </div>

      <div className="px-5 flex max-md:flex-col items-center">
        <div className="md:w-1/4 flex items-center justify-center">
          <img
            src={song.coverImgUrl}
            alt={song.songName}
            className="h-40 w-40 rounded-md object-cover"
          />
        </div>

        <div className="max-md:my-6 w-full">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold text-textcolor flex flex-wrap">{song.songName}</h1>
           <div className={`${songType==='m'?'':'hidden'}`}>
           <div
              onClick={() => handleSongClick(song.songId)}
              className="flex items-center justify-center px-4 space-x-2 py-1 text-lg font-semibold bg-slate-300 rounded-full"
            >
              <MdEdit size={20} />
              <h2>Edit</h2>
              </div>
           </div>
        </div>
          
          <h2 className="text-xl font-semibold text-textcolor">
            {artistData?.name || song.singer || "Unknown Artist"}
          </h2>

          <div
            className={`flex space-x-6 text-textcolor text-2xl my-3 ${
              songType === "m" ? "hidden" : ""
            }`}
          >
            <button
              onClick={handleLike}
              disabled={isLikeLoading}
              className={`flex items-center justify-center gap-2 ${
                isLikeLoading ? "text-gray-600" : ""
              }`}
            >
              {isLiked ? <BiSolidLike /> : <BiLike />}
              {song.likes}
            </button>
            <button
              onClick={handleDislike}
              disabled={isLikeLoading}
              className={`flex items-center justify-center gap-2 ${
                isLikeLoading ? "text-gray-600" : ""
              }`}
            >
              {isDisliked ? <BiSolidDislike /> : <BiDislike />}
              {song.dislikes}
            </button>
            <h2 className="flex items-center justify-center gap-2">
              <div>
                <MdOutlineRemoveRedEye />
              </div>
              {song.views}
            </h2>
            <div
              className="flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => handelShareClick()}
            >
              <IoMdShareAlt />
              {song.shares}
            </div>
          </div>

          <div className="text-base text-textcolor">
            <div className="flex">
              <h2 className="mr-2">Duration:</h2>
              {duration
                ? `${Math.floor(duration / 60)}:${Math.floor(duration % 60)
                    .toString()
                    .padStart(2, "0")}`
                : "Loading..."}
            </div>
            <h2>Uploaded on: {convertTimestampToDate(song.updatedOn)}</h2>
          </div>
        </div>
      </div>
      <div className="mb-5">
        <MusicPlayer
          songFileUrl={song.songUrl}
          audioRef={audioRef}
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex mx-5 bg-slate-800 rounded-lg max-md:w-[90%] p-5">
            <Share
              url={window.location.href}
              title={`Share ${song.songName} on`}
            />
            <button
              className="text-textcolor text-4xl flex pl-3"
              onClick={() => setIsShareModalOpen(false)}
            >
              <MdOutlineCancel />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongDetails;
