import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { useNavigate, Link } from "react-router-dom";
import LocalLoader from "../Loaders/LocalLoader";
import { toast } from "react-toastify";
import IndianFemale from "./IndianFemale";
import IndianMale from "./IndianMale";
import ForeignMale from "./ForeignMale";
import ForeignFemale from "./ForeignFemale";
import PopularPlaylist from "./PopularPlaylist";

const Home = ({ userType, setUserType, setArtistId, setPlaylistId }) => {
  const { user, userId, logout } = useAuth();
  const [firestoreUser, setFirestoreUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const showWelcomeToast = () => {
      if (userType === "old") {
        toast.success("Logged in Successfully!", {
          position: "top-center",
          toastId: "welcome-toast",
        });
      } else if (userType === "new") {
        toast.success("Signed Up Successfully!", {
          position: "top-center",
          toastId: "welcome-toast",
          onClose: () => setUserType("old"),
        });
      }
      localStorage.setItem("toastShown", "true");
    };

    if (userType && !toast.isActive("welcome-toast")) {
      const toastShown = localStorage.getItem("toastShown");
      if (toastShown === "false") {
        showWelcomeToast();
      }
    }
  }, [userType, setUserType]);

  useEffect(() => {
    const getFirestoreData = async () => {
      try {
        const q = query(collection(db, "users"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setFirestoreUser(doc.data());
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) {
      getFirestoreData();
    }
  }, [userId]);


  if (isLoading) {
    return <LocalLoader />;
  }

  if (!user) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <h1 className="text-3xl text-red-600 font-bold my-10">
          "Opps! Access Denied"
        </h1>
        <button
          className="text-xl text-white font-semibold border-2 px-5 py-2 rounded-lg"
          onClick={() => {
            navigate("/");
          }}
        >
          Goto Login Page
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-5 flex flex-col text-white mb-16 mt-10">
      <IndianMale />
      <IndianFemale />
      <PopularPlaylist />
      <ForeignMale />
      <ForeignFemale />
    </div>
  );
};

export default Home;
