

// const TopNav = () => {
//   const { user, userId } = useAuth();
//   const [firestoreUser, setFirestoreUser] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [myPlaylists, setMyPlaylists] = useState([]);
//   const [mySongs, setMySongs] = useState([]);
//   const navigate = useNavigate();
//   const modalRef = useRef(null);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     const getFirestoreData = async () => {
//       try {
//         const q = query(collection(db, "users"), where("userId", "==", userId));
//         const querySnapshot = await getDocs(q);
//         querySnapshot.forEach((doc) => {
//           const userData = doc.data();
//           setFirestoreUser(userData);
//           setMyPlaylists(userData.myplaylists || []); // Assuming myplaylists is stored in the user's document
//           setMySongs(userData.mysongs || []); // Assuming mysongs is stored in the user's document
//         });
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };
//     if (userId) {
//       getFirestoreData();
//     }
//   }, [userId]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         modalRef.current &&
//         !modalRef.current.contains(event.target) &&
//         !inputRef.current.contains(event.target)
//       ) {
//         setShowModal(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleUpgradeClick = () => {
//     navigate("/app/proplan");
//   };

//   const handleInputFocus = () => {
//     if (searchTerm) {
//       setShowModal(true);
//     }
//   };

//   const handleInputChange = (e) => {
//     setSearchTerm(e.target.value);
//     if (e.target.value) {
//       setShowModal(true);
//     } else {
//       setShowModal(false);
//     }
//   };

//   const clearSearch = () => {
//     setSearchTerm("");
//     setShowModal(false);
//   };

//   const filteredPlaylists = myPlaylists.filter((playlist) =>
//     playlist.playlistName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredSongs = mySongs.filter((song) =>
//     song.songName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="relative h-20 max-md:h-16  w-full bg-slate-800 md:rounded-t-lg flex justify-between px-5 py-5 shadow-md shadow-slate-900 max-md:items-center max-md:px-8">
//       <div className="md:hidden text-2xl text-white font-bold">
//         Dhun{firestoreUser && firestoreUser.proplan && <span>Pro</span>}
//       </div>
//       <div className="relative z-100 flex items-center bg-slate-600 rounded-full max-md:hidden px-3 text-white font-semibold">
//         <IoIosSearch size={30} />
//         <input
//           ref={inputRef}
//           type="text"
//           placeholder="Search..."
//           className="outline-none bg-slate-600 rounded-full px-1 pr-10"
//           value={searchTerm}
//           onChange={handleInputChange}
//           onFocus={handleInputFocus}
//         />
//         {searchTerm && (
//           <RxCross2
//             size={20}
//             onClick={clearSearch}
//             className="absolute right-2 cursor-pointer text-red-600"
//             color="white"
//           />
//         )}
//       </div>
//       <div className="flex space-x-4 cursor-pointer">
//         {firestoreUser && !firestoreUser.proplan && (
//           <div
//             onClick={handleUpgradeClick}
//             className="flex items-center justify-center md:bg-slate-600 rounded-full px-3 gap-2 text-white font-semibold"
//           >
//             <IoDiamond size={30} color="white" />
//             <div className="max-md:hidden">Upgrade</div>
//           </div>
//         )}
//         <div
//           onClick={() => navigate("/app/notifications")}
//           className="flex justify-center items-center"
//         >
//           <FaBell size={30} color="white" />
//         </div>

//         {user && firestoreUser ? (
//           <img
//             src={firestoreUser.photoURL}
//             alt="User Avatar"
//             height={40}
//             width={40}
//             className="rounded-full max-md:hidden"
//           />
//         ) : (
//           <FaUserCircle size={30} color="white" className="max-md:hidden" />
//         )}
//       </div>

//       {showModal && searchTerm && (
//         <>
//           <div
//             className="fixed inset-0 bg-black opacity-50 z-10"
//             onClick={() => setShowModal(false)} // Close modal on overlay click
//           ></div>
//           <div
//             ref={modalRef}
//             className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-slate-600 rounded-lg p-4 z-20 w-11/12 md:w-1/2"
//           >
//             <Search searchTerm={searchTerm} playlists={filteredPlaylists} songs={filteredSongs} closeModal={() => setShowModal(false)} />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default TopNav;


import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { useAuth } from "../../Context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { IoDiamond } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import Search from "../Search/Search";
import { RxCross2 } from "react-icons/rx";

const TopNav = () => {
  const { user, userId } = useAuth();
  const [firestoreUser, setFirestoreUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [mySongs, setMySongs] = useState([]);
  const [popularPlaylists, setPopularPlaylists] = useState([]);
  const [popularArtists, setPopularArtists] = useState([]);
  const navigate = useNavigate();
  const modalRef = useRef(null);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpgradeClick = () => {
    navigate("/app/proplan");
  };

  const handleInputFocus = () => {
    if (searchTerm) {
      setShowModal(true);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowModal(false);
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
    <div className="relative h-20 max-md:h-16 w-full bg-slate-800 md:rounded-t-lg flex justify-between px-5 py-5 shadow-md shadow-slate-900 max-md:items-center max-md:px-8">
      <div className="md:hidden text-2xl text-white font-bold">
        Dhun{firestoreUser && firestoreUser.proplan && <span>Pro</span>}
      </div>
      <div className="relative z-100 flex items-center bg-slate-600 rounded-full max-md:hidden px-3 text-white font-semibold">
        <IoIosSearch size={30} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          className="outline-none bg-slate-600 rounded-full px-1 pr-10"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        {searchTerm && (
          <RxCross2
            size={20}
            onClick={clearSearch}
            className="absolute right-2 cursor-pointer text-red-600"
            color="white"
          />
        )}
      </div>
      <div className="flex space-x-4 cursor-pointer">
        {firestoreUser && !firestoreUser.proplan && (
          <div
            onClick={handleUpgradeClick}
            className="flex items-center justify-center md:bg-slate-600 rounded-full px-3 gap-2 text-white font-semibold"
          >
            <IoDiamond size={30} color="white" />
            <div className="max-md:hidden">Upgrade</div>
          </div>
        )}
        <div
          onClick={() => navigate("/app/notifications")}
          className="flex justify-center items-center"
        >
          <FaBell size={30} color="white" />
        </div>

        {user && firestoreUser ? (
          <img
            src={firestoreUser.photoURL}
            alt="User Avatar"
            height={40}
            width={40}
            className="rounded-full max-md:hidden"
          />
        ) : (
          <FaUserCircle size={30} color="white" className="max-md:hidden" />
        )}
      </div>

      {showModal && searchTerm && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-10"
            onClick={() => setShowModal(false)} // Close modal on overlay click
          ></div>
          <div
            ref={modalRef}
            className=" fixed bg-slate-600 rounded-lg p-4 z-20 left-0 right-0 top-0 bottom-0 m-20 overflow-scroll scrollbar-hide"
          >
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

export default TopNav;
