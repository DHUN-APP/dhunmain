
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { useAuth } from "../../Context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase-config";
import Search from "./Search";
import { RxCross2 } from "react-icons/rx";

const MobileSearch = () => {
  const { user, userId } = useAuth();
  const [firestoreUser, setFirestoreUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [myPlaylists, setMyPlaylists] = useState([]);
  const [mySongs, setMySongs] = useState([]);
  const [popularPlaylists, setPopularPlaylists] = useState([]);
  const [popularArtists, setPopularArtists] = useState([]);
  const navigate = useNavigate();

  const inputRef = useRef(null);


  useEffect(() => {
    const getFirestoreData = async () => {
      try {
        const userQuery = query(collection(db, "users"), where("userId", "==", userId));
        const userSnapshot = await getDocs(userQuery);
        userSnapshot.forEach((doc) => {
          const userData = doc.data();
          setFirestoreUser(userData);
          setMyPlaylists(userData.myplaylists || []);
          setMySongs(userData.mysongs || []);
        });

        const playlistsQuery = query(collection(db, "playlists"));
        const playlistsSnapshot = await getDocs(playlistsQuery);
        const playlistsData = playlistsSnapshot.docs.map((doc) => doc.data());
        setPopularPlaylists(playlistsData);

        const artistsQuery = query(collection(db, "artists"));
        const artistsSnapshot = await getDocs(artistsQuery);
        const artistsData = artistsSnapshot.docs.map((doc) => doc.data());
        setPopularArtists(artistsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userId) {
      getFirestoreData();
    }
  }, [userId]);




  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const filteredPlaylists = myPlaylists.filter((playlist) =>
    playlist.playlistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSongs = mySongs.filter((song) =>
    song.songName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPopularPlaylists = popularPlaylists.filter((playlist) =>
    playlist.playlistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (


    <div className="w-full flex flex-col px-5 mb-24">

      <div className="flex items-center bg-slate-600 rounded-full px-3 text-white font-semibold h-12 text-lg my-10">
        <div className="flex items-center justify-center w-[15%]"><IoIosSearch size={25} /></div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          className="outline-none w-[70%] bg-transparent"
          value={searchTerm}
          onChange={handleInputChange}
        />
        {searchTerm && (
          <div className="flex items-center justify-center w-[15%]">
          <RxCross2
            onClick={clearSearch}
            className="cursor-pointer"
            size={25}
          />
          </div>
        )}
      </div>


      {searchTerm && (
        <>
          <div className="w-full bg-slate-600 p-3 rounded-md">
            <Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              playlists={filteredPlaylists}
              songs={filteredSongs}
              popularPlaylists={filteredPopularPlaylists}
              popularArtists={popularArtists}
              closeModal={() => setShowModal(false)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MobileSearch;
