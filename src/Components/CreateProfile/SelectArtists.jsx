import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { db } from "../../../firebase-config";
import { collection, getDocs, doc, setDoc, updateDoc,increment } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import UniversalLoader from "../Loaders/UniversalLoader";
import { UisCheckCircle } from "@iconscout/react-unicons-solid";
import { UilArrowRight } from "@iconscout/react-unicons";
import { toast } from "react-toastify";

const SelectArtists = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "artists"));
        const artistData = [];
        querySnapshot.forEach((doc) => {
          artistData.push({ id: doc.id, ...doc.data() });
        });
        setArtists(artistData);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const handleArtistSelect = (artistId) => {
    setSelectedArtists((prevSelected) =>
      prevSelected.includes(artistId)
        ? prevSelected.filter((id) => id !== artistId)
        : [...prevSelected, artistId]
    );
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (selectedArtists.length < 3) {
  //     toast.error("Select at least 3 artists!", {
  //       position: "top-center",
  //       toastId: "welcome-toast",
  //     });
  //     return;
  //   }
  //   try {
  //     setIsLoading(true);
  //     const userDocRef = doc(db, "users", userId);
  //     await setDoc(
  //       userDocRef,
  //       {
  //         artists: selectedArtists,
  //       },
  //       { merge: true }
  //     );
  //     navigate("/createprofile/playlist");
  //   } catch (error) {
  //     console.error("Error saving artists:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedArtists.length < 3) {
      toast.error("Select at least 3 artists!", {
        position: "top-center",
        toastId: "welcome-toast",
      });
      return;
    }
    try {
      setIsLoading(true);
      const userDocRef = doc(db, "users", userId);
  
      // Update the user's document with the selected artists
      await setDoc(
        userDocRef,
        {
          artists: selectedArtists,
        },
        { merge: true }
      );
  
      // Increment the followers count for each selected artist
      const incrementFollowersPromises = selectedArtists.map((artistId) => {
        const artistDocRef = doc(db, "artists", artistId);
        return updateDoc(artistDocRef, {
          followers: increment(1),
        });
      });
  
      // Execute all the promises
      await Promise.all(incrementFollowersPromises);
      navigate("/createprofile/playlist");
    } catch (error) {
      console.error("Error saving artists:", error);
      toast.error("Failed to save artists.");
    } finally {
      setIsLoading(false);
    }
  };
  

  if (isLoading) {
    return <UniversalLoader />;
  }

  return (
    <div className="w-full h-screen flex flex-col items-center overflow-y-scroll scrollbar-hide">
      <h1 className="text-3xl max-md:text-xl max-md:border-2 max-md:px-5 max-md:mb-6 text-textcolor font-bold mt-14 mb-8 border-4 border-primarycolor px-10 flex justify-center rounded-full py-2">
        Select Your Favorite Artists
      </h1>

      <ul className="w-full flex flex-wrap justify-center mb-[150px]">
        {artists.map((artist) => (
          <li
            key={artist.id}
            className={`h-[230px] m-3 list-none cursor-pointer transition-colors duration-300 ease-in-out ${
              selectedArtists.includes(artist.id) ? "selected" : ""
            }`}
            onClick={() => handleArtistSelect(artist.id)}
          >
            <div className="h-[18%]">
              <div
                className={`w-full flex justify-end translate-y-8 -translate-x-1 ${
                  selectedArtists.includes(artist.id) ? "" : "hidden"
                }`}
              >
                <UisCheckCircle size={40} color="white" />
              </div>
            </div>
            <img
              src={artist.photoURL}
              alt={artist.name}
              className="h-[150px] w-[150px] rounded-full border-4 shadow-inner"
            />
            <p className="text-black text-md font-semibold w-full bg-primarycolor flex justify-center -translate-y-6 p-2 rounded-full">
              {artist.name}
            </p>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubmit}
        className="border-4 text-xl flex bg-primarybg text-textcolor py-2 px-5 rounded-full font-bold my-14 absolute bottom-0 shadow-black shadow-lg"
      >
        Next
        <UilArrowRight size={30} color="#abc0da" />
      </button>
    </div>
  );
};

export default SelectArtists;



