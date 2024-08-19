


import React, { useEffect, useState } from "react";
import { db } from "../../../firebase-config";
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoPersonRemove, IoPersonAdd } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { toast } from "react-toastify";
import { TiArrowBack } from "react-icons/ti";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { MdOutlineCancel } from "react-icons/md";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { GoInfo } from "react-icons/go";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoMusicalNote } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";
import LocalLoader from "../Loaders/LocalLoader";
import Share from "../Share/Share";

const FollowingDetails = () => {
  const queryParams = new URLSearchParams(location.search);
  const artistId = queryParams.get('a');
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isViewed, setIsViewed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState(songs);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);



  useEffect(() => {

    const fetchArtistDetails = async () => {
        try {
            setIsLoading(true);
            const artistDocRef = doc(db, "artists", artistId);

            const artistDoc = await getDoc(artistDocRef);
            if (artistDoc.exists()) {
                const artistData = artistDoc.data();
                setArtist(artistData);
                setSongs(artistData.songs || []);

                // Increment the views field for the artist
                await updateDoc(artistDocRef, {
                    views: (artistData.views || 0) + 1
                });

                const userDocRef = doc(db, "users", userId);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setIsFollowed(userData.artists?.includes(artistId));
                }
            } else {
                console.log("No such artist document!");
            }
        } catch (error) {
            console.error("Error fetching artist details: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (artistId) {
        fetchArtistDetails();
    }
}, [artistId, userId]);

  

  const handleFollowToggle = async () => {
    try {
      setIsLoading(true);
      const userDocRef = doc(db, "users", userId);
      const artistDocRef = doc(db, "artists", artistId);

      if (isFollowed) {
        await updateDoc(userDocRef, {
          artists: arrayRemove(artistId),
        });
        await updateDoc(artistDocRef, {
          followers: increment(-1),
        });

        toast.success("Artist Unfollowed Successfully!");
      } else {
        await updateDoc(userDocRef, {
          artists: arrayUnion(artistId),
        });
        await updateDoc(artistDocRef, {
          followers: increment(1),
        });

        toast.success("Artist Followed Successfully!");
      }

      setIsFollowed(!isFollowed);
    } catch (error) {
      console.error("Error toggling follow status: ", error);
      toast.error("Failed to toggle follow status.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSongClick = (songId) => {
    navigate(`/app/songdetails?t=a&a=${artistId}&s=${songId}`);
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


  useEffect(() => {
    if (searchQuery === '') {
        setFilteredSongs(songs);
    } else {
        setFilteredSongs(
            songs.filter((song) =>
                song.songName.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }
}, [searchQuery, songs]);



  if (isLoading) {
    return <LocalLoader />;
  }

  return (
    <div className="p-5 max-md:p-3 flex flex-col relative mt-8 mb-16">
      <div className="mb-3 flex">
        <div onClick={() => navigate(-1)}>
          <TiArrowBack size={40} color="white" />
        </div>
      </div>
      {artist ? (
        <div>
          <div className="absolute top-5 right-10 max-md:right-5 space-x-3 text-white text-2xl max-md:text-xl">
            <button onClick={() => setIsShareModalOpen(true)} className=" p-2 rounded-full border-2"><IoShareSocialOutline/></button>
            <button
              onClick={handleFollowToggle}
              className=" p-2 rounded-full border-2"
            >
              {isFollowed ? (
                <IoPersonRemove />
              ) : (
                <IoPersonAdd />
              )}
            </button>
          </div>
          
 

          <div className="flex items-center max-md:flex-col">
            <div className="md:w-1/4 flex items-center justify-center">
              <img
                src={artist.photoURL || "default-image-url"}
                alt={artist.name}
                className="h-40 w-40 rounded-full object-cover border-4 border-white"
              />
            </div>

            <div className="flex flex-col space-y-4 md:ml-4">
              <div className="flex items-center space-x-3 max-md:mt-5">
                <h1 className="text-4xl max-md:text-2xl font-semibold text-textcolor">
                  {artist.name}
                </h1>
                <MdVerified size={20} color="#1d9ceb" />
              </div>
              <div className="md:font-bold flex md:gap-3 items-center max-md:justify-center text-2xl max-md:text-base text-center text-textcolor">
                <h2 className="flex items-center mr-5">
                <div className="flex items-center justify-center mr-2"><IoPerson /></div> {artist.followers || 0} Followers
                </h2>
                <h2 className="flex items-center mr-5">
                <div className="flex items-center justify-center mr-2"><IoMusicalNote  /> </div>{artist.songs?.length || 0} Songs
                </h2>
                <h2 className="flex items-center mr-5">
                <div className="flex items-center justify-center mr-2"><FaArrowTrendUp /></div> {artist.views || 0} Views
                </h2>
              </div>
              <h2 className="flex items-center text-textcolor text-lg max-md:text-base mr-5">
                <div className="flex items-center justify-center mr-2"><GoInfo /></div>Joined: {convertTimestampToDate(artist.createdOn)}
                </h2>
            </div>


          </div>
          <div className="w-full flex justify-center">
            <hr className="h-1 w-[95%] my-8 bg-gray-200 border-0 dark:bg-gray-700" />
          </div>

          


          <div className="px-5">
            <div className="flex items-center mb-6">
            <h2 className="text-2xl font-semibold text-textcolor">
                Songs
            </h2>
            <div className="ml-3 flex items-center border-primarycolor text-white font-semibold border-b-2">
                <IoIosSearch size={20} />
                <input
                    type="text"
                    placeholder="Search Songs"
                    className="outline-none bg-slate-800 max-md:bg-primarybg px-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSongs.length > 0 ? (
                    filteredSongs.map((song) => (
                        <div
                            key={song.songId}
                            className="flex items-center space-x-4 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300 border-2 cursor-pointer"
                            onClick={() => handleSongClick(song.songId)}
                        >
                            <img
                                src={song.coverImgUrl || "default-cover.jpg"}
                                alt={song.songName}
                                className="h-20 w-20 max-md:h-16 max-md:w-16 rounded object-cover"
                            />
                            <div className="flex flex-col">
                                <p className="text-textcolor text-lg max-md:text-base font-semibold">
                                    {song.songName}
                                </p>
                                <div className="text-xl  md:font-semibold flex gap-3 items-center text-textcolor text-center">
                                    <h2 className="flex items-center mr-5">
                                        <div className="flex items-center justify-center mr-2"><BiLike /></div> {song.likes || 0}
                                    </h2>
                                    <h2 className="flex items-center mr-5">
                                        <div className="flex items-center justify-center mr-2"><BiDislike /></div>{song.dislikes || 0}
                                    </h2>
                                    <h2 className="flex items-center mr-5">
                                        <div className="flex items-center justify-center mr-2"><MdOutlineRemoveRedEye /></div> {song.views || 0}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-lg font-semibold text-textcolor">
                        No songs found
                    </p>
                )}
            </div>
        </div>
        </div>
      ) : (
        <p className="text-lg font-semibold text-textcolor">Loading...</p>
      )}
      {isShareModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="flex mx-5 bg-slate-800 rounded-lg max-md:w-[90%] p-5">
          <Share url={window.location.href} title={`Share ${artist.name} on`} />
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

export default FollowingDetails;
