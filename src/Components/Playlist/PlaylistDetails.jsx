import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../../firebase-config";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { TiArrowBack } from "react-icons/ti";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { IoIosHeartEmpty } from "react-icons/io";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { GoInfo } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineSort } from "react-icons/md";
import LocalLoader from "../Loaders/LocalLoader";
import { toast } from "react-toastify";

const PlaylistDetails = ({ setSongId }) => {
  const [playlist, setPlaylist] = useState(null);
  const [songsDetails, setSongsDetails] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");

  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const playlistId = queryParams.get("p");
  const playlistType = queryParams.get("t");

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        setIsLoading(true);

        if (playlistType === "myplaylist") {
          // Fetch user's own playlist
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
                .map((song) => ({
                  ...songsMap[song.songId],
                  addedOn: song.addedOn, // Ensure addedOn is included
                }))
                .filter((song) => song !== undefined);
              setSongsDetails(playlistSongsDetails);
            } else {
              console.error("My Playlist not found");
            }
          } else {
            console.error("User document does not exist");
          }
        } else if (playlistType === "externalplaylist") {
          // Fetch external playlist from the playlists collection
          const playlistDocRef = doc(db, "playlists", playlistId);
          const playlistDocSnapshot = await getDoc(playlistDocRef);

          if (playlistDocSnapshot.exists()) {
            const playlistData = playlistDocSnapshot.data();
            setPlaylist({
              ...playlistData,
              playlistId: playlistDocSnapshot.id,
            });

            await updateDoc(playlistDocRef, {
              views: (playlistData.views || 0) + 1
            });

            // Check if the user is following this playlist
            const userDocRef = doc(db, "users", userId);
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
              const userData = userDocSnapshot.data();
              const isFollowing = userData.playlists.some(
                (playlist) => playlist.playlistId === playlistId
              );
              setIsFollowing(isFollowing);
            }

            // Fetch all artists and their songs
            const artistsRef = collection(db, "artists");
            const artistSnapshots = await getDocs(artistsRef);

            const artistSongsMap = {};
            artistSnapshots.forEach((artistDoc) => {
              const artistData = artistDoc.data();
              artistData.songs.forEach((song) => {
                artistSongsMap[song.songId] = {
                  ...song,
                  artistName: artistData.name,
                  artistId : artistData.artistId,
                };
              });
            });

            // Match songs in the playlist with the songs from the artists collection
            const playlistSongsDetails = playlistData.songs
              .map((song) => ({
                ...artistSongsMap[song.songId],
                addedOn: song.addedOn, // Ensure addedOn is included
              }))
              .filter((song) => song !== undefined);

            setSongsDetails(playlistSongsDetails);
          } else {
            console.error("External Playlist not found");
          }
        }
      } catch (error) {
        console.error("Error fetching playlist details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylistDetails();
  }, [playlistId, playlistType, userId]);

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


  const handleFollow = async () => {
    try {
      setIsLoading(true);
      const userDocRef = doc(db, "users", userId);
      const playlistDocRef = doc(db, "playlists", playlistId);

      if (isFollowing) {
        // Unfollow logic
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const updatedPlaylists = userData.playlists.filter(
            (playlist) => playlist.playlistId !== playlistId
          );

          await updateDoc(userDocRef, {
            playlists: updatedPlaylists,
          });
          await updateDoc(playlistDocRef, {
            followers: (playlist.followers || 0) - 1,
          });
          setIsFollowing(false);
          toast.success("Playlist unfollowed Successfully!", {
            position: "top-center",
            toastId: "welcome-toast",
          });
        }
      } else {
        // Follow logic
        await updateDoc(userDocRef, {
          playlists: arrayUnion({
            playlistId,
            followedOn: new Date().toISOString(),
          }),
        });
        await updateDoc(playlistDocRef, {
          followers: (playlist.followers || 0) + 1,
        });
        setIsFollowing(true);
        toast.success("Playlist followed Successfully!", {
          position: "top-center",
          toastId: "welcome-toast",
        });
      }
    } catch (error) {
      console.error("Error following/unfollowing playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const filteredSongs = songsDetails.filter(
  //   (song) =>
  //     song.songName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     song.artistName.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const filteredSongs = songsDetails.filter(
    (song) =>
      (song.songName && song.songName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (song.artistName && song.artistName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (song.singer && song.singer.toLowerCase().includes(searchQuery.toLowerCase())) 
  );
  

  const sortSongs = (songs) => {
    switch (sortOption) {
      case "name-asc":
        return songs.sort((a, b) => a.songName.localeCompare(b.songName));
      case "name-desc":
        return songs.sort((a, b) => b.songName.localeCompare(a.songName));
      case "recently-added":
        return songs.sort((a, b) => b.addedOn - a.addedOn);
      default:
        return songs;
    }
  };

  const sortedSongs = sortSongs([...filteredSongs]); // Spread to avoid mutating the original array

  const handleSongClick = (song) => {
    if (playlistType === 'myplaylist') {
      navigate(`/app/songdetails?t=m&s=${song.songId}`);
    } else if (playlistType === 'externalplaylist') {
      navigate(`/app/songdetails?t=a&a=${song.artistId}&s=${song.songId}`);
    }
  };
  
  
  


  if (isLoading) {
    return <LocalLoader />;
  }

  if (!playlist) {
    return <div>Playlist not found</div>;
  }

  return (
    <div className="flex flex-col mt-10 px-5 mb-24">
      <div className="mb-3 flex">
        <div onClick={() => navigate(-1)}>
          <TiArrowBack size={40} color="white" />
        </div>
      </div>

      <div className="flex w-full max-md:flex-col max-md:justify-center md:mt-10 md:px-5">
        <div className="max-md:w-full flex items-center justify-center">
        <img
          src={playlist.coverImgUrl}
          alt={playlist.playlistName}
          className="h-36 w-36 rounded-md bg-slate-600"
        />
        </div>

        <div className="w-full px-5 flex flex-col justify-center max-md:mt-10 overflow-hidden">
          <div className="flex justify-between items-center overflow-hidden w-full">
            <div className="text-4xl max-md:text-2xl font-bold flex items-center text-textcolor truncate">
              {playlist.playlistName}
            </div>
            {playlistType === "myplaylist" ? (
              <div
                onClick={() => navigate(`/app/editplaylist?p=${playlist.playlistId}`)}
                className="flex items-center justify-center px-6 max-md:px-3 text-lg font-semibold py-2 max-md:py-1 bg-slate-300 gap-2 max-md:gap-1 rounded-full"
              >
                <MdEdit size={20} />
                Edit
              </div>
            ) : (
              <div
                onClick={handleFollow}
                className=" text-2xl border-2 rounded-full border-primarycolor text-textcolor p-1"
              >
                {isFollowing ? <IoHeart /> : <IoHeartOutline />}
              </div>
            )}
          </div>

          <h2 className="text-textcolor font-semibold text-2xl max-md:text-xl">
            Songs : {playlist.songs.length}
          </h2>
          <div
            className={`flex text-2xl max-md:text-xl text-textcolor font-semibold items-center space-x-4 ${
              playlistType === "myplaylist" ? "hidden" : ""
            }`}
          >
            <div className="space-x-1 flex items-center">
              <IoIosHeartEmpty />
              <h2>{playlist.followers}</h2>
            </div>
            <div className="space-x-1 flex items-center">
              <MdOutlineRemoveRedEye />
              <h2>{playlist.views}</h2>
            </div>
          </div>
          <div className="flex text-textcolor text-lg max-md:text-base items-center space-x-2">
            <GoInfo />
            <h2>Last Updated : {convertTimestampToDate(playlist.updatedOn)}</h2>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <hr className="h-1 w-[95%] my-8 max-md:my-4 bg-gray-200 border-0 dark:bg-gray-700" />
      </div>

      <div className="flex space-x-5 items-center md:my-5 max-md:flex-col">
        <h2 className="text-2xl max-md:text-xl font-semibold text-textcolor">
          Songs
        </h2>
        <div className="flex space-x-5">
        <div className="ml-5 max-md:ml-3 max-md:my-5 flex items-center border-primarycolor text-white font-semibold border-b-2">
          <IoIosSearch size={20} />
          <input
            type="text"
            placeholder="Search Songs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none bg-slate-800 max-md:bg-primarybg px-1 max-md:w-32"
          />
        </div>
        <div className="flex space-x-2 text-textcolor items-center">
        <MdOutlineSort />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-1 bg-slate-600 rounded-full outline-none"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="recently-added">Recently Added</option>
        </select>
        </div>
        </div>
        
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-md:h-64 max-md:overflow-x-scroll max-md:border-2 max-md:p-2 max-md:rounded-lg">
        {sortedSongs.length > 0 ? (
          sortedSongs.map((song, index) => (
            <div
              key={index}
              onClick={() => handleSongClick(song)}
              className="flex h-fit items-center space-x-4 p-2 m-1 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300 border-2 cursor-pointer"
            >
              <img
                src={song.coverImgUrl}
                alt={song.songName}
                className="h-16 w-16 rounded-md"
              />
              <div className="ml-3 flex flex-col w-full overflow-hidden">
                <div className="text-lg font-semibold text-textcolor overflow-hidden  truncate">
                  {song.songName}
                </div>
                <div className="text-md font-semibold text-textcolor">
                  {song.artistName || song.singer}
                </div>
                {song.addedOn && (
                  <div className="text-sm  text-textcolor">
                    Added On: {convertTimestampToDate(song.addedOn)}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <h1 className="w-full flex max-md:justify-center max-md:items-center text-textcolor text-xl font-semibold">No songs found</h1>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetails;
