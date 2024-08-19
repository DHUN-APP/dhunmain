// import React, { useState, useEffect } from "react";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   getDoc,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "../../../../firebase-config";
// import { toast } from "react-toastify";

// const AddSong = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [selectedArtistId, setSelectedArtistId] = useState("");
//   const [artistName, setArtistName] = useState("");
//   const [songs, setSongs] = useState([
//     { songName: "", songId: "", coverImgUrl: "", songUrl: "" },
//   ]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (selectedArtistId) {
//       fetchArtistName();
//     }
//   }, [selectedArtistId]);

//   const fetchSuggestions = async (term) => {
//     try {
//       if (term.length === 0) {
//         setSuggestions([]);
//         return;
//       }

//       const q = query(
//         collection(db, "artists"),
//         where("name", ">=", ""),
//         where("name", "<=", "\uf8ff")
//       );

//       const querySnapshot = await getDocs(q);
//       const results = [];
//       querySnapshot.forEach((doc) => {
//         results.push({ id: doc.id, ...doc.data() });
//       });

//       const filteredResults = results.filter((item) => {
//         return item.name.toLowerCase().includes(term.toLowerCase());
//       });

//       filteredResults.sort((a, b) => {
//         const aName = a.name.toLowerCase();
//         const bName = b.name.toLowerCase();

//         const aMatch = aName.indexOf(term.toLowerCase());
//         const bMatch = bName.indexOf(term.toLowerCase());

//         if (aMatch !== -1 && bMatch !== -1) {
//           return aMatch - bMatch;
//         }

//         if (aMatch !== -1) return -1;
//         if (bMatch !== -1) return 1;

//         return aName.localeCompare(bName);
//       });

//       setSuggestions(filteredResults);
//     } catch (error) {
//       console.error("Error fetching suggestions:", error);
//       toast.error("Error fetching suggestions.");
//     }
//   };

//   const fetchArtistName = async () => {
//     try {
//       const docRef = doc(db, "artists", selectedArtistId);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         setArtistName(docSnap.data().name);
//       } else {
//         toast.error("Artist not found.");
//       }
//     } catch (error) {
//       console.error("Error fetching artist name:", error);
//       toast.error("Error fetching artist name.");
//     }
//   };

//   const handleSearchTermChange = (event) => {
//     setSelectedArtistId("");
//     const term = event.target.value;
//     setSearchTerm(term);
//     fetchSuggestions(term);
//   };

//   const handleSuggestionClick = (artist) => {
//     setSelectedArtistId(artist.id);
//     setSuggestions([]);
//     setSearchTerm(artist.name);
//   };

//   const handleAddSong = () => {
//     setSongs([
//       ...songs,
//       { songName: "", songId: "", coverImgUrl: "", songUrl: "" },
//     ]);
//   };

//   const handleInputChange = (index, field, value) => {
//     const updatedSongs = [...songs];
//     updatedSongs[index][field] = value;
//     setSongs(updatedSongs);
//   };

//   const handleDeleteSong = (index) => {
//     const updatedSongs = songs.filter((_, i) => i !== index);
//     setSongs(updatedSongs);
//   };

//   // const handleSubmit = async (event) => {
//   //   event.preventDefault();
//   //   setIsLoading(true);

//   //   try {
//   //     const docRef = doc(db, "artists", selectedArtistId);
//   //     const artistDoc = await getDoc(docRef);
//   //     const existingSongs = artistDoc.data().songs || [];

//   //     const existingSongIdMap = new Map();
//   //     existingSongs.forEach((song) => existingSongIdMap.set(song.songId, true));

//   //     const newSongIdMap = new Map();
//   //     const duplicateWithinNewSongs = [];
//   //     songs.forEach((song, index) => {
//   //       if (newSongIdMap.has(song.songId)) {
//   //         duplicateWithinNewSongs.push(
//   //           `Song ${index + 1} ID is duplicated in the submission`
//   //         );
//   //       }
//   //       newSongIdMap.set(song.songId, true);
//   //     });

//   //     const duplicates = [];
//   //     songs.forEach((song, index) => {
//   //       if (existingSongIdMap.has(song.songId)) {
//   //         duplicates.push(`Song ${index + 1} ID already exists`);
//   //       }
//   //     });

//   //     if (duplicates.length > 0) {
//   //       duplicates.forEach((msg) => toast.error(msg));
//   //     }

//   //     if (duplicateWithinNewSongs.length > 0) {
//   //       duplicateWithinNewSongs.forEach((msg) => toast.error(msg));
//   //     }

//   //     if (duplicates.length > 0 || duplicateWithinNewSongs.length > 0) {
//   //       setIsLoading(false);
//   //       return;
//   //     }

//   //     const updatedSongs = [...existingSongs, ...songs];

//   //     await updateDoc(docRef, {
//   //       songs: updatedSongs,
//   //     });

//   //     toast.success("Songs added successfully!");
//   //     setSearchTerm("");
//   //     setSelectedArtistId("");
//   //     setArtistName("");
//   //     setSongs([{ songName: "", songId: "", coverImgUrl: "", songUrl: "" }]);
//   //   } catch (error) {
//   //     console.error("Error adding songs:", error);
//   //     toast.error("Error adding songs.");
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsLoading(true);

//     try {
//       const docRef = doc(db, "artists", selectedArtistId);
//       const artistDoc = await getDoc(docRef);

//       // Ensure that existingSongs is always an array
//       const existingSongs = Array.isArray(artistDoc.data().songs) ? artistDoc.data().songs : [];

//       const existingSongIdMap = new Map();
//       existingSongs.forEach((song) => existingSongIdMap.set(song.songId, true));

//       const newSongIdMap = new Map();
//       const duplicateWithinNewSongs = [];
//       songs.forEach((song, index) => {
//         if (newSongIdMap.has(song.songId)) {
//           duplicateWithinNewSongs.push(
//             `Song ${index + 1} ID is duplicated in the submission`
//           );
//         }
//         newSongIdMap.set(song.songId, true);
//       });

//       const duplicates = [];
//       songs.forEach((song, index) => {
//         if (existingSongIdMap.has(song.songId)) {
//           duplicates.push(`Song ${index + 1} ID already exists`);
//         }
//       });

//       if (duplicates.length > 0) {
//         duplicates.forEach((msg) => toast.error(msg));
//       }

//       if (duplicateWithinNewSongs.length > 0) {
//         duplicateWithinNewSongs.forEach((msg) => toast.error(msg));
//       }

//       if (duplicates.length > 0 || duplicateWithinNewSongs.length > 0) {
//         setIsLoading(false);
//         return;
//       }

//       const updatedSongs = [...existingSongs, ...songs];

//       await updateDoc(docRef, {
//         songs: updatedSongs,
//       });

//       toast.success("Songs added successfully!");
//       setSearchTerm("");
//       setSelectedArtistId("");
//       setArtistName("");
//       setSongs([{ songName: "", songId: "", coverImgUrl: "", songUrl: "" }]);
//     } catch (error) {
//       console.error("Error adding songs:", error);
//       toast.error("Error adding songs.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form className="flex flex-col w-[90%]" onSubmit={handleSubmit}>
//       <h2 className=" text-xl text-textcolor font-semibold mt-5 mb-2">
//         Select Artist:
//       </h2>
//       <input
//         type="text"
//         value={searchTerm}
//         onChange={handleSearchTermChange}
//         placeholder="Enter artist name"
//         className="w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none"
//         required
//       />
//       {suggestions.length > 0 && (
//         <ul className="mt-2 max-h-60 overflow-y-auto">
//           {suggestions.map((artist) => (
//             <li
//               key={artist.id}
//               onClick={() => handleSuggestionClick(artist)}
//               className="p-2 font-bold bg-slate-300 mt-1 cursor-pointer rounded-md hover:bg-slate-400"
//             >
//               {artist.name}
//             </li>
//           ))}
//         </ul>
//       )}

//       {selectedArtistId && (
//         <>
//           <div className="flex items-center justify-center my-5">
//             <h2 className="border-2 border-primarycolor rounded-md text-xl text-textcolor font-semibold py-2 px-5">
//               {artistName}
//             </h2>
//           </div>

//           {songs.map((song, index) => (
//             <div
//               key={index}
//               className="mb-4 flex max-md:flex-col md:items-center justify-center gap-3"
//             >
//               <h2 className="text-xl text-textcolor font-semibold">
//                 Song: {index + 1}
//               </h2>
//               <div className="flex items-center justify-center bg-slate-400  rounded-md">
//                 <h3 className="max-md:w-[20%] p-2 text-slate-900 font-bold  rounded-l-md">
//                   Name
//                 </h3>
//                 <input
//                   type="text"
//                   value={song.songName}
//                   onChange={(e) =>
//                     handleInputChange(index, "songName", e.target.value)
//                   }
//                   placeholder="Song Name"
//                   className="max-md:w-full p-2 bg-slate-600 text-lg text-white font-semibold outline-none rounded-r-md"
//                   required
//                 />
//               </div>
//               <div className="flex items-center justify-center bg-slate-400  rounded-md">
//                 <h3 className="max-md:w-[20%] p-2 text-slate-900 font-bold  rounded-l-md">
//                   ID
//                 </h3>
//                 <input
//                   type="text"
//                   value={song.songId}
//                   onChange={(e) =>
//                     handleInputChange(index, "songId", e.target.value)
//                   }
//                   placeholder="Song ID"
//                   className="max-md:w-full p-2 bg-slate-600 text-lg text-white font-semibold outline-none rounded-r-md"
//                   required
//                 />
//               </div>
//               <div className="flex items-center justify-center bg-slate-400  rounded-md">
//                 <h3 className="max-md:w-[20%] p-2 text-slate-900 font-bold  rounded-l-md">
//                   Cover
//                 </h3>
//                 <input
//                   type="text"
//                   value={song.coverImgUrl}
//                   onChange={(e) =>
//                     handleInputChange(index, "coverImgUrl", e.target.value)
//                   }
//                   placeholder="Song Cover Image URL"
//                   className="max-md:w-full p-2 bg-slate-600 text-lg text-white font-semibold outline-none rounded-r-md"
//                   required
//                 />
//               </div>

//               <div className="flex items-center justify-center bg-slate-400  rounded-md">
//                 <h3 className="max-md:w-[20%] p-2 text-slate-900 font-bold  rounded-l-md">
//                   File
//                 </h3>
//                 <input
//                   type="text"
//                   value={song.songUrl}
//                   onChange={(e) =>
//                     handleInputChange(index, "songUrl", e.target.value)
//                   }
//                   placeholder="Song URL"
//                   className="max-md:w-full p-2 bg-slate-600 text-lg text-white font-semibold  outline-none rounded-r-md"
//                   required
//                 />
//               </div>

//               <button
//                 onClick={() => handleDeleteSong(index)}
//                 className="max-md:w-full p-2 h-full bg-red-600 text-white font-semibold rounded-md"
//                 type="button"
//               >
//                 Delete
//               </button>
//             </div>
//           ))}

//           <button
//             onClick={handleAddSong}
//             className=" mt-2 p-2 bg-primarycolor text-slate-900 font-bold text-xl rounded-md"
//             type="button"
//           >
//             Add Another Song
//           </button>

//           <button
//             type="submit"
//             className="mt-5 p-2 bg-primarycolor text-slate-900 font-bold text-xl rounded-md"
//             disabled={isLoading}
//           >
//             {isLoading ? "Loading..." : "Submit"}
//           </button>
//         </>
//       )}
//     </form>
//   );
// };

// export default AddSong;

import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase-config";
import { toast } from "react-toastify";

const AddSong = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState("");
  const [artistName, setArtistName] = useState("");
  const [songs, setSongs] = useState([
    {
      songName: "",
      songId: "",
      coverImgUrl: "",
      songUrl: "",
      createdOn: "",
      updatedOn: "",
      likes: 0,
      dislikes: 0,
      views: 0,
      shares: 0,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedArtistId) {
      fetchArtistName();
    }
  }, [selectedArtistId]);

  const fetchSuggestions = async (term) => {
    try {
      if (term.length === 0) {
        setSuggestions([]);
        return;
      }

      const q = query(
        collection(db, "artists"),
        where("name", ">=", ""),
        where("name", "<=", "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });

      const filteredResults = results.filter((item) => {
        return item.name.toLowerCase().includes(term.toLowerCase());
      });

      filteredResults.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        const aMatch = aName.indexOf(term.toLowerCase());
        const bMatch = bName.indexOf(term.toLowerCase());

        if (aMatch !== -1 && bMatch !== -1) {
          return aMatch - bMatch;
        }

        if (aMatch !== -1) return -1;
        if (bMatch !== -1) return 1;

        return aName.localeCompare(bName);
      });

      setSuggestions(filteredResults);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast.error("Error fetching suggestions.");
    }
  };

  const fetchArtistName = async () => {
    try {
      const docRef = doc(db, "artists", selectedArtistId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setArtistName(docSnap.data().name);
      } else {
        toast.error("Artist not found.");
      }
    } catch (error) {
      console.error("Error fetching artist name:", error);
      toast.error("Error fetching artist name.");
    }
  };

  const handleSearchTermChange = (event) => {
    setSelectedArtistId("");
    const term = event.target.value;
    setSearchTerm(term);
    fetchSuggestions(term);
  };

  const handleSuggestionClick = (artist) => {
    setSelectedArtistId(artist.id);
    setSuggestions([]);
    setSearchTerm(artist.name);
  };

  const handleAddSong = () => {
    setSongs([
      ...songs,
      {
        songName: "",
        songId: "",
        coverImgUrl: "",
        songUrl: "",
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        views: 0,
        shares: 0,
      },
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedSongs = [...songs];
    updatedSongs[index][field] = value;
    updatedSongs[index].updatedOn = new Date().toISOString(); // Update `updatedOn` on any change
    setSongs(updatedSongs);
  };

  const handleDeleteSong = (index) => {
    const updatedSongs = songs.filter((_, i) => i !== index);
    setSongs(updatedSongs);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const docRef = doc(db, "artists", selectedArtistId);
      const artistDoc = await getDoc(docRef);

      // Ensure that existingSongs is always an array
      const existingSongs = Array.isArray(artistDoc.data().songs)
        ? artistDoc.data().songs
        : [];

      const existingSongIdMap = new Map();
      existingSongs.forEach((song) => existingSongIdMap.set(song.songId, true));

      const newSongIdMap = new Map();
      const duplicateWithinNewSongs = [];
      songs.forEach((song, index) => {
        if (newSongIdMap.has(song.songId)) {
          duplicateWithinNewSongs.push(
            `Song ${index + 1} ID is duplicated in the submission`
          );
        }
        newSongIdMap.set(song.songId, true);
      });

      const duplicates = [];
      songs.forEach((song, index) => {
        if (existingSongIdMap.has(song.songId)) {
          duplicates.push(`Song ${index + 1} ID already exists`);
        }
      });

      if (duplicates.length > 0) {
        duplicates.forEach((msg) => toast.error(msg));
      }

      if (duplicateWithinNewSongs.length > 0) {
        duplicateWithinNewSongs.forEach((msg) => toast.error(msg));
      }

      if (duplicates.length > 0 || duplicateWithinNewSongs.length > 0) {
        setIsLoading(false);
        return;
      }

      const updatedSongs = [...existingSongs, ...songs];

      await updateDoc(docRef, {
        songs: updatedSongs,
      });

      toast.success("Songs added successfully!");
      setSearchTerm("");
      setSelectedArtistId("");
      setArtistName("");
      setSongs([
        {
          songName: "",
          songId: "",
          coverImgUrl: "",
          songUrl: "",
          createdOn: new Date().toISOString(),
          updatedOn: new Date().toISOString(),
          likes: [],
          dislikes: [],
          views: 0,
          shares: 0,
        },
      ]);
    } catch (error) {
      console.error("Error adding songs:", error);
      toast.error("Error adding songs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col w-[90%]" onSubmit={handleSubmit}>
      <h2 className="text-xl text-textcolor font-semibold mt-5 mb-2">
        Select Artist:
      </h2>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchTermChange}
        placeholder="Enter artist name"
        className="w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none"
        required
      />
      {suggestions.length > 0 && (
        <ul className="mt-2 max-h-60 overflow-y-auto">
          {suggestions.map((artist) => (
            <li
              key={artist.id}
              onClick={() => handleSuggestionClick(artist)}
              className="p-2 font-bold bg-slate-300 mt-1 cursor-pointer rounded-md hover:bg-slate-400"
            >
              {artist.name}
            </li>
          ))}
        </ul>
      )}

      {selectedArtistId && (
        <>
          <div className="flex items-center justify-center my-5">
            <h2 className="border-2 border-primarycolor rounded-md text-xl text-textcolor font-semibold py-2 px-5">
              {artistName}
            </h2>
          </div>

          {songs.map((song, index) => (
            <div
              key={index}
              className="mb-4 flex max-md:flex-col md:items-center justify-center gap-3"
            >
              <h2 className="text-xl text-textcolor font-semibold">
                Song: {index + 1}
              </h2>
              <div className="flex items-center justify-center bg-slate-400 rounded-md">
                <h3 className="max-md:w-[20%] p-2 text-slate-900 font-bold rounded-l-md">
                  Name
                </h3>
                <input
                  type="text"
                  value={song.songName}
                  onChange={(e) =>
                    handleInputChange(index, "songName", e.target.value)
                  }
                  placeholder="Song Name"
                  className="max-md:w-full p-2 bg-slate-600 text-lg text-white font-semibold outline-none rounded-r-md"
                  required
                />
              </div>
              <div className="flex items-center justify-center bg-slate-400 rounded-md">
                <h3 className="max-md:w-[20%] p-2 text-slate-900 font-bold rounded-l-md">
                  ID
                </h3>
                <input
                  type="text"
                  value={song.songId}
                  onChange={(e) =>
                    handleInputChange(index, "songId", e.target.value)
                  }
                  placeholder="Song ID"
                  className="max-md:w-full p-2 bg-slate-600 text-lg text-white font-semibold outline-none rounded-r-md"
                  required
                />
              </div>
              <div className="flex items-center justify-center bg-slate-400 rounded-md">
                <h3 className="max-md:w-[20%] p-2 text-slate-900 font-bold rounded-l-md">
                  Cover
                </h3>
                <input
                  type="text"
                  value={song.coverImgUrl}
                  onChange={(e) =>
                    handleInputChange(index, "coverImgUrl", e.target.value)
                  }
                  placeholder="Song Cover Image URL"
                  className="max-md p-2 bg-slate-600 text-lg text-white font-semibold outline-none rounded-r-md"
                  required
                />
              </div>
              <div className="flex items-center justify-center bg-slate-400 rounded-md">
                <h3 className="max-md:w-[20%] p-2 text-slate-900 font-bold rounded-l-md">
                  File
                </h3>
                <input
                  type="text"
                  value={song.songUrl}
                  onChange={(e) =>
                    handleInputChange(index, "songUrl", e.target.value)
                  }
                  placeholder="Song URL"
                  className="max-md:w-full p-2 bg-slate-600 text-lg text-white font-semibold outline-none rounded-r-md"
                  required
                />
              </div>

              <button
                onClick={() => handleDeleteSong(index)}
                className="max-md:w-full p-2 h-full bg-red-600 text-white font-semibold rounded-md"
                type="button"
              >
                Delete
              </button>
            </div>
          ))}

          <button
            onClick={handleAddSong}
            className="mt-2 p-2 bg-primarycolor text-slate-900 font-bold text-xl rounded-md"
            type="button"
          >
            Add Another Song
          </button>

          <button
            type="submit"
            className="mt-5 p-2 bg-primarycolor text-slate-900 font-bold text-xl rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </>
      )}
    </form>
  );
};

export default AddSong;