// import React, { useEffect, useState } from "react";
// import { IoPerson } from "react-icons/io5";
// import { IoIosSearch } from "react-icons/io";
// import { db } from "../../../firebase-config";
// import { useAuth } from "../../Context/AuthContext";
// import { doc, getDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// const MyFollowings = ({ setArtistId }) => {
//   const { userId } = useAuth();
//   const [artists, setArtists] = useState([]);
//   const [filteredArtists, setFilteredArtists] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchArtists = async () => {
//       try {
//         const userDocRef = doc(db, "users", userId);
//         const userDoc = await getDoc(userDocRef);
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           const artistsData = await Promise.all(
//             (userData.artists || []).map(async (artistId) => {
//               const artistDocRef = doc(db, "artists", artistId);
//               const artistDoc = await getDoc(artistDocRef);
//               if (artistDoc.exists()) {
//                 return { ...artistDoc.data(), artistId };
//               } else {
//                 return null;
//               }
//             })
//           );
//           setArtists(artistsData.filter((artist) => artist !== null));
//         }
//       } catch (error) {
//         console.error("Error fetching artists: ", error);
//       }
//     };

//     if (userId) {
//       fetchArtists();
//     }
//   }, [userId]);

//   useEffect(() => {
//     const filterArtists = () => {
//       const queryLower = searchQuery.toLowerCase();
//       const filtered = artists.filter((artist) =>
//         artist.name?.toLowerCase().includes(queryLower)
//       );
//       setFilteredArtists(filtered);
//     };

//     filterArtists();
//   }, [searchQuery, artists]);

//   const handleArtistClick = (artistId) => {
//     setArtistId(artistId);
//     navigate(`/app/followingdetails?a=${artistId}`);
//   };

//   return (
//     <div className="p-5 max-md:p-3 flex flex-col">
//       <div className="flex justify-between max-md:flex-col">
//         <div className="flex items-center gap-5 max-md:gap-2 text-primarycolor max-md:flex-col">
//           <div className="flex items-center justify-center gap-3">
//             <IoPerson size={30} />
//             <h1 className="text-3xl max-md:text-xl font-semibold text-textcolor">
//               My Followings ({filteredArtists.length}/{artists.length})
//             </h1>
//           </div>
//           <div className="ml-5 max-md:ml-3 max-md:my-5 flex items-center border-primarycolor text-white font-semibold border-b-2">
//             <IoIosSearch size={20} />
//             <input
//               type="text"
//               placeholder="Search Artist"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="outline-none bg-slate-800 max-md:bg-primarybg px-1"
//             />
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-wrap mt-10 max-md:mt-3  max-md:justify-center max-md:h-64 max-md:border-2 max-md:rounded-lg max-md:overflow-x-scroll">
//         {filteredArtists.length > 0 ? (
//           filteredArtists.map((artist) => (
//             <div
//               key={artist.artistId}
//               onClick={() => handleArtistClick(artist.artistId)}
//               className="flex flex-col items-center cursor-pointer m-2"
//             >
//               <img
//                 src={artist.photoURL || "default-image-url"}
//                 alt={artist.name}
//                 className="h-24 w-24 rounded-full object-cover mb-2 border-4 border-white"
//               />
//               <p className="text-center text-textcolor text-sm font-semibold">
//                 {artist.name}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="text-lg font-semibold text-textcolor">
//             No artists found
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyFollowings;


import React, { useEffect, useState } from "react";
import { IoPerson } from "react-icons/io5";
import { MdOutlineSort } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { db } from "../../../firebase-config";
import { useAuth } from "../../Context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const MyFollowings = ({ setArtistId }) => {
  const { userId } = useAuth();
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [nameSort, setNameSort] = useState("A-Z");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const artistsData = await Promise.all(
            (userData.artists || []).map(async (artistId) => {
              const artistDocRef = doc(db, "artists", artistId);
              const artistDoc = await getDoc(artistDocRef);
              if (artistDoc.exists()) {
                return { ...artistDoc.data(), artistId };
              } else {
                return null;
              }
            })
          );
          setArtists(artistsData.filter((artist) => artist !== null));
        }
      } catch (error) {
        console.error("Error fetching artists: ", error);
      }
    };

    if (userId) {
      fetchArtists();
    }
  }, [userId]);

  useEffect(() => {
    const filterAndSortArtists = () => {
      let filtered = artists;

      // Apply type filter
      if (typeFilter !== "all") {
        filtered = filtered.filter((artist) => artist.artistType === typeFilter);
      }

      // Apply gender filter
      if (genderFilter !== "all") {
        filtered = filtered.filter((artist) => artist.gender === genderFilter);
      }

      // Apply search filter
      const queryLower = searchQuery.toLowerCase();
      filtered = filtered.filter((artist) =>
        artist.name?.toLowerCase().includes(queryLower)
      );

      // Apply name sorting
      filtered.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (nameSort === "A-Z") {
          return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        } else {
          return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
        }
      });

      setFilteredArtists(filtered);
    };

    filterAndSortArtists();
  }, [searchQuery, typeFilter, genderFilter, nameSort, artists]);

  const handleArtistClick = (artistId) => {
    setArtistId(artistId);
    navigate(`/app/followingdetails?a=${artistId}`);
  };

  return (
    <div className="p-5 max-md:p-3 flex flex-col">
      <div className="flex justify-between max-md:flex-col">
        <div className="flex items-center gap-5 max-md:gap-2 text-primarycolor max-md:flex-col">

          <div className="flex items-center justify-center gap-3">
            <IoPerson size={30} />
            <h1 className="text-3xl max-md:text-xl font-semibold text-textcolor">
              My Followings ({filteredArtists.length}/{artists.length})
            </h1>
          </div>

          <div className="ml-5 max-md:ml-3 max-md:my-5 flex items-center border-primarycolor text-white font-semibold border-b-2">
            <IoIosSearch size={20} />
            <input
              type="text"
              placeholder="Search Artist"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none bg-slate-800 max-md:bg-primarybg px-1"
            />
          </div>

        <div className="flex justify-between items-center space-x-3">
        <div className="text-xl max-md:hidden"><MdOutlineSort /></div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-1 bg-slate-600 rounded-full outline-none"
        >
          <option value="all">All Types</option>
          <option value="indian">Indian</option>
          <option value="foreigner">Foreigner</option>
        </select>
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="p-1 bg-slate-600 rounded-full outline-none"
        >
          <option value="all">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select
          value={nameSort}
          onChange={(e) => setNameSort(e.target.value)}
          className="p-1 bg-slate-600 rounded-full outline-none"
        >
          <option value="A-Z">Name (A-Z)</option>
          <option value="Z-A">Name (Z-A)</option>
        </select>
      </div>



        </div>
      </div>
      
      <div className="flex flex-wrap mt-10 max-md:mt-3  max-md:justify-center max-md:h-64 max-md:border-2 max-md:rounded-lg max-md:overflow-x-scroll">
        {filteredArtists.length > 0 ? (
          filteredArtists.map((artist) => (
            <div
              key={artist.artistId}
              onClick={() => handleArtistClick(artist.artistId)}
              className="flex flex-col items-center cursor-pointer m-2"
            >
              <img
                src={artist.photoURL || "default-image-url"}
                alt={artist.name}
                className="h-24 w-24 rounded-full object-cover mb-2 border-4 border-white"
              />
              <p className="text-center text-textcolor text-sm font-semibold">
                {artist.name}
              </p>
            </div>
          ))
        ) : (
          <p className="text-lg font-semibold text-textcolor">
            No artists found
          </p>
        )}
      </div>
    </div>
  );
};

export default MyFollowings;
