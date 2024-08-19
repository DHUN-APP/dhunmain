// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { IoMusicalNote } from "react-icons/io5";
// import { FaPlus } from "react-icons/fa";
// import { IoIosSearch } from "react-icons/io";
// import { TbPlaylist } from "react-icons/tb";
// import { IoIosHeartEmpty } from "react-icons/io";
// import { MdOutlineRemoveRedEye } from "react-icons/md";
// import { FiExternalLink } from "react-icons/fi";
// import { IoLockClosedSharp } from "react-icons/io5";
// import { useAuth } from "../../Context/AuthContext";
// import { doc, getDoc, getDocs, collection, updateDoc, query, where } from "firebase/firestore";
// import { db } from "../../../firebase-config";

// const Myplaylists = ({ setPlaylistId }) => {
//   const { userId } = useAuth();
//   const [playlists, setPlaylists] = useState([]);
//   const [filteredPlaylists, setFilteredPlaylists] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPlaylists = async () => {
//       if (userId) {
//         try {
//           const userDocRef = doc(db, "users", userId);
//           const userDocSnapshot = await getDoc(userDocRef);
//           if (userDocSnapshot.exists()) {
//             const userData = userDocSnapshot.data();

//             let combinedPlaylists = [];

//             if (Array.isArray(userData.myplaylists)) {
//               const myPlaylists = userData.myplaylists.map((playlist) => ({
//                 ...playlist,
//                 type: "myplaylist",
//               }));
//               combinedPlaylists = [...myPlaylists];
//             } else {
//               console.error("myplaylists data is not an array");
//             }

//             if (Array.isArray(userData.playlists)) {
//               const playlistsRef = collection(db, "playlists");
//               const playlistsQuery = query(
//                 playlistsRef,
//                 where("playlistId", "in", userData.playlists)
//               );

//               const playlistsSnapshot = await getDocs(playlistsQuery);
//               const fetchedPlaylists = playlistsSnapshot.docs.map((doc) => ({
//                 ...doc.data(),
//                 type: "externalplaylist",
//               }));

//               combinedPlaylists = [...combinedPlaylists, ...fetchedPlaylists];
//             } else {
//               console.error("playlists data is not an array");
//             }

//             setPlaylists(combinedPlaylists);
//             setFilteredPlaylists(combinedPlaylists);
//           } else {
//             console.error("No such user document!");
//           }
//         } catch (error) {
//           console.error("Error fetching playlists:", error);
//         }
//       } else {
//         console.error("User ID not found");
//       }
//     };

//     fetchPlaylists();
//   }, [userId]);

//   useEffect(() => {
//     const filterPlaylists = () => {
//       const queryLower = searchQuery.toLowerCase();
//       const filtered = playlists.filter((playlist) =>
//         playlist.playlistName?.toLowerCase().includes(queryLower)
//       );
//       setFilteredPlaylists(filtered);
//     };

//     filterPlaylists();
//   }, [searchQuery, playlists]);

//   const handleClick = async (playlist) => {
//     if (!playlist.playlistId) {
//       console.error("playlistId is undefined");
//       return;
//     }

//     setPlaylistId(playlist.playlistId);

//     if (playlist.type === "myplaylist") {
//       navigate(`/app/playlist`);
//     } else if (playlist.type === "externalplaylist") {
//       navigate(`/app/globalplaylist`);
//     }

//     if (userId) {
//       try {
//         const userDocRef = doc(db, "users", userId);
//         await updateDoc(userDocRef, {
//           lastPlayedPlaylist: playlist.playlistId,
//         });
//       } catch (error) {
//         console.error("Error updating lastPlayed field:", error);
//       }
//     }
//   };

//   return (
//     <div className="p-5 max-md:p-3 flex flex-col">
//       <div className="flex justify-between max-md:flex-col">
//         <div className="flex items-center gap-5 max-md:gap-2 text-primarycolor max-md:flex-col">
//           <div className="flex items-center justify-center gap-3">
//             <TbPlaylist size={30} />
//             <h1 className="text-3xl max-md:text-xl font-semibold text-textcolor">
//               My Playlists ({filteredPlaylists.length}/{playlists.length})
//             </h1>
//           </div>
//           <div className="ml-5 max-md:ml-3 max-md:my-5 flex items-center border-primarycolor text-white font-semibold border-b-2">
//             <IoIosSearch size={20} />
//             <input
//               type="text"
//               placeholder="Search Playlist"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="outline-none bg-slate-800 px-1"
//             />
//           </div>
//         </div>
//         <div
//           onClick={() => navigate("/app/addplaylist")}
//           className="max-md:my-5 flex items-center justify-center text-textcolor font-bold gap-2 py-1 px-3 border-2 rounded-full border-primarycolor max-md:bg-primarycolor max-md:text-slate-900 cursor-pointer"
//         >
//           <FaPlus /> New Playlist
//         </div>
//       </div>

//       <div className="flex flex-wrap mt-10">
//         {filteredPlaylists.length > 0 ? (
//           filteredPlaylists.map((playlist) => (
//             <div
//               key={playlist.playlistId}
//               onClick={() => handleClick(playlist)}
//               className="flex bg-slate-700 w-[360px] m-1 p-2 items-center rounded-md text-textcolor"
//             >

//               <img
//                 src={playlist.coverImgUrl || "default-cover.jpg"}
//                 alt={`Cover for playlist ${playlist.playlistName}`}
//                 className="h-20 w-20 bg-slate-500"
//               />
//               <div className="w-full pl-3 overflow-hidden">
//                 <div className="flex justify-between items-center w-full">
//                   <h2 className="text-xl font-bold truncate">{playlist.playlistName}</h2>
//                   <div className="p-2">{playlist.type==='myplaylist' ? <IoLockClosedSharp /> : <FiExternalLink />}</div>
//                 </div>
//                 <h2 className="text-md font-semibold">Songs: {playlist.songs?.length}</h2>
//                 <div className={`flex items-center text-md space-x-4 font-semibold ${playlist.type==='myplaylist'?'hidden':''}`}>
//                   <div className="flex items-center space-x-1"><IoIosHeartEmpty /><h1>{playlist.followers}</h1></div>
//                   <div className="flex items-center space-x-1"><MdOutlineRemoveRedEye /><h1>{playlist.views}</h1></div>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-lg font-semibold text-textcolor">
//             No playlists found
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Myplaylists;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { IoMusicalNote } from "react-icons/io5";
// import { FaPlus } from "react-icons/fa";
// import { IoIosSearch } from "react-icons/io";
// import { TbPlaylist } from "react-icons/tb";
// import { IoIosHeartEmpty } from "react-icons/io";
// import { MdOutlineRemoveRedEye } from "react-icons/md";
// import { FiExternalLink } from "react-icons/fi";
// import { IoLockClosedSharp } from "react-icons/io5";
// import { useAuth } from "../../Context/AuthContext";
// import { doc, getDoc, getDocs, collection, updateDoc, query, where } from "firebase/firestore";
// import { db } from "../../../firebase-config";

// const Myplaylists = ({ setPlaylistId }) => {
//   const { userId } = useAuth();
//   const [playlists, setPlaylists] = useState([]);
//   const [filteredPlaylists, setFilteredPlaylists] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPlaylists = async () => {
//       if (userId) {
//         try {
//           const userDocRef = doc(db, "users", userId);
//           const userDocSnapshot = await getDoc(userDocRef);
//           if (userDocSnapshot.exists()) {
//             const userData = userDocSnapshot.data();

//             let combinedPlaylists = [];

//             if (Array.isArray(userData.myplaylists)) {
//               const myPlaylists = userData.myplaylists.map((playlist) => ({
//                 ...playlist,
//                 type: "myplaylist",
//               }));
//               combinedPlaylists = [...myPlaylists];
//             } else {
//               console.error("myplaylists data is not an array");
//             }

//             if (Array.isArray(userData.playlists) && userData.playlists.length > 0) {
//               // Extract playlistIds from objects in userData.playlists
//               const playlistIds = userData.playlists.map(playlist => playlist.playlistId);

//               const playlistsRef = collection(db, "playlists");
//               const playlistsQuery = query(
//                 playlistsRef,
//                 where("playlistId", "in", playlistIds)
//               );

//               const playlistsSnapshot = await getDocs(playlistsQuery);
//               const fetchedPlaylists = playlistsSnapshot.docs.map((doc) => ({
//                 ...doc.data(),
//                 type: "externalplaylist",
//               }));

//               combinedPlaylists = [...combinedPlaylists, ...fetchedPlaylists];
//             } else {
//               console.error("playlists data is not an array or is empty");
//             }

//             setPlaylists(combinedPlaylists);
//             setFilteredPlaylists(combinedPlaylists);
//           } else {
//             console.error("No such user document!");
//           }
//         } catch (error) {
//           console.error("Error fetching playlists:", error);
//         }
//       } else {
//         console.error("User ID not found");
//       }
//     };

//     fetchPlaylists();
//   }, [userId]);

//   useEffect(() => {
//     const filterPlaylists = () => {
//       const queryLower = searchQuery.toLowerCase();
//       const filtered = playlists.filter((playlist) =>
//         playlist.playlistName?.toLowerCase().includes(queryLower)
//       );
//       setFilteredPlaylists(filtered);
//     };

//     filterPlaylists();
//   }, [searchQuery, playlists]);

//   const handleClick = async (playlist) => {
//     if (!playlist.playlistId) {
//       console.error("playlistId is undefined");
//       return;
//     }

//     setPlaylistId(playlist.playlistId);

//     if (playlist.type === "myplaylist") {
//       navigate(`/app/playlist`);
//     } else if (playlist.type === "externalplaylist") {
//       navigate(`/app/globalplaylist`);
//     }

//     if (userId) {
//       try {
//         const userDocRef = doc(db, "users", userId);
//         await updateDoc(userDocRef, {
//           lastPlayedPlaylist: playlist.playlistId,
//         });
//       } catch (error) {
//         console.error("Error updating lastPlayed field:", error);
//       }
//     }
//   };

//   return (
//     <div className="p-5 max-md:p-3 flex flex-col">
//       <div className="flex justify-between max-md:flex-col">
//         <div className="flex items-center gap-5 max-md:gap-2 text-primarycolor max-md:flex-col">
//           <div className="flex items-center justify-center gap-3">
//             <TbPlaylist size={30} />
//             <h1 className="text-3xl max-md:text-xl font-semibold text-textcolor">
//               My Playlists ({filteredPlaylists.length}/{playlists.length})
//             </h1>
//           </div>
//           <div className="ml-5 max-md:ml-3 max-md:my-5 flex items-center border-primarycolor text-white font-semibold border-b-2">
//             <IoIosSearch size={20} />
//             <input
//               type="text"
//               placeholder="Search Playlist"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="outline-none bg-slate-800 px-1"
//             />
//           </div>
//         </div>
//         <div
//           onClick={() => navigate("/app/addplaylist")}
//           className="max-md:my-5 flex items-center justify-center text-textcolor font-bold gap-2 py-1 px-3 border-2 rounded-full border-primarycolor max-md:bg-primarycolor max-md:text-slate-900 cursor-pointer"
//         >
//           <FaPlus /> New Playlist
//         </div>
//       </div>

//       <div className="flex flex-wrap mt-10">
//         {filteredPlaylists.length > 0 ? (
//           filteredPlaylists.map((playlist) => (
//             <div
//               key={playlist.playlistId}
//               onClick={() => handleClick(playlist)}
//               className="flex bg-slate-700 w-[360px] m-1 p-2 items-center rounded-md text-textcolor"
//             >
//               <img
//                 src={playlist.coverImgUrl || "default-cover.jpg"}
//                 alt={`Cover for playlist ${playlist.playlistName}`}
//                 className="h-20 w-20 bg-slate-500"
//               />
//               <div className="w-full pl-3 overflow-hidden">
//                 <div className="flex justify-between items-center w-full">
//                   <h2 className="text-xl font-bold truncate">{playlist.playlistName}</h2>
//                   <div className="p-2">{playlist.type === 'myplaylist' ? <IoLockClosedSharp /> : <FiExternalLink />}</div>
//                 </div>
//                 <h2 className="text-md font-semibold">Songs: {playlist.songs?.length}</h2>
//                 <div className={`flex items-center text-md space-x-4 font-semibold ${playlist.type === 'myplaylist' ? 'hidden' : ''}`}>
//                   <div className="flex items-center space-x-1"><IoIosHeartEmpty /><h1>{playlist.followers}</h1></div>
//                   <div className="flex items-center space-x-1"><MdOutlineRemoveRedEye /><h1>{playlist.views}</h1></div>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-lg font-semibold text-textcolor">
//             No playlists found
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Myplaylists;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMusicalNote } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { TbPlaylist } from "react-icons/tb";
import { IoIosHeartEmpty } from "react-icons/io";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import { IoLockClosedSharp } from "react-icons/io5";
import { MdOutlineSort } from "react-icons/md";
import { useAuth } from "../../Context/AuthContext";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase-config";

const Myplaylists = ({ setPlaylistId }) => {
  const { userId } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [playlistFilter, setPlaylistFilter] = useState("All");
  // const [sortOption, setSortOption] = useState("Latest");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (userId) {
        try {
          const userDocRef = doc(db, "users", userId);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();

            let combinedPlaylists = [];

            if (Array.isArray(userData.myplaylists)) {
              const myPlaylists = userData.myplaylists.map((playlist) => ({
                ...playlist,
                type: "myplaylist",
              }));
              combinedPlaylists = [...myPlaylists];
            } else {
              console.error("myplaylists data is not an array");
            }

            if (
              Array.isArray(userData.playlists) &&
              userData.playlists.length > 0
            ) {
              const playlistIds = userData.playlists.map(
                (playlist) => playlist.playlistId
              );

              const playlistsRef = collection(db, "playlists");
              const playlistsQuery = query(
                playlistsRef,
                where("playlistId", "in", playlistIds)
              );

              const playlistsSnapshot = await getDocs(playlistsQuery);
              const fetchedPlaylists = playlistsSnapshot.docs.map((doc) => ({
                ...doc.data(),
                type: "externalplaylist",
                followedOn: userData.playlists.find(
                  (p) => p.playlistId === doc.id
                ).followedOn,
              }));

              combinedPlaylists = [...combinedPlaylists, ...fetchedPlaylists];
            }

            setPlaylists(combinedPlaylists);
            setFilteredPlaylists(combinedPlaylists);
          }
        } catch (error) {
          console.error("Error fetching playlists:", error);
        }
      }
    };

    fetchPlaylists();
  }, [userId]);

  useEffect(() => {
    const filterPlaylists = () => {
      let filtered = playlists;

      if (playlistFilter !== "All") {
        filtered = playlists.filter((playlist) =>
          playlistFilter === "My Playlist"
            ? playlist.type === "myplaylist"
            : playlist.type === "externalplaylist"
        );
      }

      if (searchQuery) {
        filtered = filtered.filter((playlist) =>
          playlist.playlistName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      }

      // if (sortOption === "Oldest") {
      //   filtered.sort((a, b) => {
      //     const dateA = new Date(a.type === "myplaylist" ? a.updatedOn : a.followedOn);
      //     const dateB = new Date(b.type === "myplaylist" ? b.updatedOn : b.followedOn);
      //     return dateB - dateA;
      //   });
      // } else if (sortOption === "Latest") {
      //   filtered.sort((a, b) => {
      //     const dateA = new Date(a.type === "myplaylist" ? a.updatedOn : a.followedOn);
      //     const dateB = new Date(b.type === "myplaylist" ? b.updatedOn : b.followedOn);
      //     return dateA - dateB;
      //   });
      // } else if (sortOption === "Name (A-Z)") {
      //   filtered.sort((a, b) => a.playlistName.localeCompare(b.playlistName));
      // } else if (sortOption === "Name (Z-A)") {
      //   filtered.sort((a, b) => b.playlistName.localeCompare(a.playlistName));
      // } else if (sortOption === "Recently Updated") {
      //   filtered.sort((a, b) => {
      //     const dateA = new Date(a.updatedOn);
      //     const dateB = new Date(b.updatedOn);
      //     return dateB - dateA;
      //   });
      // }

      setFilteredPlaylists(filtered);
    };

    filterPlaylists();
  }, [searchQuery, playlistFilter, playlists]);

  const handleClick = async (playlist) => {
    if (!playlist.playlistId) {
      console.error("playlistId is undefined");
      return;
    }
    navigate(`/app/playlist?t=${playlist.type}&p=${playlist.playlistId}`);
    if (userId) {
      try {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
          lastPlayedPlaylist: playlist.playlistId,
        });
      } catch (error) {
        console.error("Error updating lastPlayed field:", error);
      }
    }
  };

  return (
    <div className="p-5 max-md:p-3 flex flex-col">
      <div className="flex justify-between max-md:flex-col">

        <div className="flex items-center gap-5 max-md:gap-2 text-primarycolor max-md:flex-col ">

          <div className="flex items-center justify-center gap-3">
            <TbPlaylist size={30} />
            <h1 className="text-3xl max-md:text-xl font-semibold text-textcolor">
              My Playlists ({filteredPlaylists.length}/{playlists.length})
            </h1>
          </div>

          <div className="flex space-x-4">
            <div className="ml-5 max-md:ml-3 max-md:my-5 flex items-center border-primarycolor text-white font-semibold border-b-2">
              <IoIosSearch size={20} />
              <input
                type="text"
                placeholder="Search Playlist"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-none bg-slate-800 max-md:bg-primarybg px-1 max-md:w-36"
              />
            </div>

            <div className="flex text-white items-center space-x-2 outline-none">
              <div className="text-xl">
                <MdOutlineSort />
              </div>
              <select
                value={playlistFilter}
                onChange={(e) => setPlaylistFilter(e.target.value)}
                className="p-1 bg-slate-600 rounded-full outline-none"
              >
                <option value="All">All Playlist</option>
                <option value="My Playlist">Own Playlist</option>
                <option value="Followed Playlist">Followed Playlist</option>
              </select>
            </div>
          </div>
        </div>
        <div
          onClick={() => navigate("/app/addplaylist")}
          className="max-md:my-5 flex items-center justify-center text-textcolor font-bold gap-2 py-1 px-3 border-2 rounded-full border-primarycolor max-md:bg-primarycolor max-md:text-slate-900 cursor-pointer"
        >
          <FaPlus /> New Playlist
        </div>
      </div>

      <div className="flex md:mt-10 flex-wrap max-md:h-52 max-md:overflow-x-scroll max-md:border-2 max-md:p-2 max-md:rounded-lg">
        {filteredPlaylists.length > 0 ? (
          filteredPlaylists.map((playlist) => (
            <div
              key={playlist.playlistId}
              onClick={() => handleClick(playlist)}
              className="flex bg-slate-700 w-[360px] m-1 p-2 items-center rounded-md text-textcolor max-md:h-fit"
            >
              <img
                src={playlist.coverImgUrl || "default-cover.jpg"}
                alt={`Cover for playlist ${playlist.playlistName}`}
                className="h-20 w-20 bg-slate-500"
              />

              <div className="w-full pl-3 overflow-hidden">
                  <h2 className="text-xl font-bold truncate">{playlist.playlistName}</h2>
                  <h2 className="text-md font-semibold">Songs: {playlist.songs?.length}</h2>
                  <div
                    className={`flex items-center space-x-4 ${
                      playlist.type === "myplaylist" ? "hidden" : ""
                    }`}
                  >
                    <div className="space-x-1 flex items-center"><IoIosHeartEmpty /><h2>{playlist.followers}</h2></div>
                    <div className="space-x-1 flex items-center"><MdOutlineRemoveRedEye /><h2>{playlist.views}</h2></div>
                </div>
              </div>
     
              <div className="p-2 h-full">
                    {playlist.type === "myplaylist" ? (
                      <IoLockClosedSharp />
                    ) : (
                      <FiExternalLink />
                    )}
              </div>

            </div>
          ))
        ) : (
          <h1 className="text-2xl mt-10 text-center font-semibold text-textcolor">
            No Playlists Found
          </h1>
        )}
      </div>
    </div>
  );
};

export default Myplaylists;
