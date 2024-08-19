// import React, { useState } from "react";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   getDoc,
//   setDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "../../../../firebase-config";
// import { toast } from "react-toastify";

// const CreateArtist = () => {
//   const [artistName, setArtistName] = useState("");
//   const [artistId, setArtistId] = useState("");
//   const [photoURL, setPhotoURL] = useState("");
//   const [artistType, setArtistType] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleCreateArtist = async (event) => {
//     event.preventDefault();

//     if (!artistName || !artistId || !photoURL || !artistType) {
//       toast.error("All fields are required.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const artistDocRef = doc(db, "artists", artistId);
//       const artistDocSnapshot = await getDoc(artistDocRef);

//       if (artistDocSnapshot.exists()) {
//         toast.error("Artist with this ID already exists.");
//         return;
//       }

//       await setDoc(artistDocRef, {
//         name: artistName,
//         artistId,
//         photoURL,
//         artistType,
//         songs: [],
//       });

//       toast.success("Artist created successfully!");
//       setArtistName("");
//       setArtistId("");
//       setPhotoURL("");
//       setArtistType("");
//     } catch (error) {
//       console.error("Error creating artist:", error);
//       toast.error("Error creating artist.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col w-[400px] max-md:w-[90%]">
//       <form onSubmit={handleCreateArtist} className="flex flex-col w-full">
//         <h2 className="text-xl text-textcolor font-semibold mt-5 mb-2">
//           Name :
//         </h2>
//         <input
//           type="text"
//           value={artistName}
//           onChange={(e) => setArtistName(e.target.value)}
//           placeholder="Enter Artist Name"
//           className="w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none"
//           required
//         />
//         <h2 className="text-xl text-textcolor font-semibold mt-5 mb-2">
//           Artist ID :
//         </h2>
//         <input
//           type="text"
//           value={artistId}
//           onChange={(e) => setArtistId(e.target.value)}
//           placeholder="Enter Unique Artist ID"
//           className="w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none"
//           required
//         />
//         <h2 className="text-xl text-textcolor font-semibold mt-5 mb-2">
//           Profile Photo Link :
//         </h2>
//         <input
//           type="text"
//           value={photoURL}
//           onChange={(e) => setPhotoURL(e.target.value)}
//           placeholder="Enter Profile Photo URL"
//           className="w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none"
//           required
//         />
//         <h2 className="text-xl text-textcolor font-semibold mt-5 mb-2">
//           Artist Type :
//         </h2>
//         <select
//           value={artistType}
//           onChange={(e) => setArtistType(e.target.value)}
//           className="w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none"
//           required
//         >
//           <option value="">Select Artist Type</option>
//           <option value="indian_male">Indian Male</option>
//           <option value="indian_female">Indian Female</option>
//           <option value="foreigner_male">Foreigner Male</option>
//           <option value="foreigner_female">Foreigner Female</option>
//         </select>
//         <button
//           type="submit"
//           className="w-full p-2 flex items-center justify-center bg-primarycolor text-xl text-slate-900 font-bold rounded-md mt-10"
//           disabled={loading}
//         >
//           {loading ? "Creating..." : "Create Artist"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateArtist;


import React, { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../../firebase-config";
import { toast } from "react-toastify";

const CreateArtist = () => {
  const [artistName, setArtistName] = useState("");
  const [artistId, setArtistId] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [artistType, setArtistType] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateArtist = async (event) => {
    event.preventDefault();

    if (!artistName || !artistId || !photoURL || !artistType || !gender) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const artistDocRef = doc(db, "artists", artistId);
      const artistDocSnapshot = await getDoc(artistDocRef);

      if (artistDocSnapshot.exists()) {
        toast.error("Artist with this ID already exists.");
        return;
      }

      await setDoc(artistDocRef, {
        name: artistName,
        artistId,
        photoURL,
        artistType,
        gender,
        songs: [],
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
        followers: 0,
        views: 0,
      });

      toast.success("Artist created successfully!");
      setArtistName("");
      setArtistId("");
      setPhotoURL("");
      setArtistType("");
      setGender("");
    } catch (error) {
      console.error("Error creating artist:", error);
      toast.error("Error creating artist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-[400px] max-md:w-[90%]">
      <form onSubmit={handleCreateArtist} className="flex flex-col w-full">
        <h2 className="text-xl text-textcolor font-semibold mt-5 mb-2">
          Name :
        </h2>
        <input
          type="text"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          placeholder="Enter Artist Name"
          className="w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none"
          required
        />
        <h2 className="text-xl text-textcolor font-semibold mt-5 mb-2">
          Artist ID :
        </h2>
        <input
          type="text"
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
          placeholder="Enter Unique Artist ID"
          className="w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none"
          required
        />
        <h2 className="text-xl text-textcolor font-semibold mt-5 mb-2">
          Profile Photo Link :
        </h2>
        <input
          type="text"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
          placeholder="Enter Profile Photo URL"
          className="w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none"
          required
        />
        <h2 className="text-xl text-textcolor font-semibold mt-5 mb-2">
          Artist Type :
        </h2>
        <select
          value={artistType}
          onChange={(e) => setArtistType(e.target.value)}
          className="w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none"
          required
        >
          <option value="">Select Artist Type</option>
          <option value="indian">Indian</option>
          <option value="foreigner">Foreigner</option>
        </select>
        <h2 className="text-xl text-textcolor font-semibold mt-5 mb-2">
          Gender :
        </h2>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full p-2 bg-slate-600 text-lg text-white font-semibold rounded-md outline-none"
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
        </select>
        <button
          type="submit"
          className="w-full p-2 flex items-center justify-center bg-primarycolor text-xl text-slate-900 font-bold rounded-md mt-10"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Artist"}
        </button>
      </form>
    </div>
  );
};

export default CreateArtist;
