import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "../../firebase-config";
import { useAuth } from "../Context/AuthContext";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase-config";

import { UilGoogle } from "@iconscout/react-unicons";
import UniversalLoader from "../Components/Loaders/UniversalLoader";

const AuthLogin = ({ setUserType }) => {
  const navigate = useNavigate();
  const { setUser, setUserId } = useAuth();
  const [isFirestoreLoading, setIsFirestoreLoading] = useState(false);

  useEffect(() => {
    const autoLogin = localStorage.getItem("autoLogin");
    const storedUserType = localStorage.getItem("userType");
    if (autoLogin && storedUserType && storedUserType !== "admin") {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const storedUserId = localStorage.getItem("userId");
      if (storedUser && storedUserId) {
        setUser(storedUser);
        setUserId(storedUserId);
        setUserType(storedUserType);
        navigate("/app/home");
      }
    }
  }, [navigate, setUser, setUserId, setUserType]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
      setUserId(user.uid);

      setIsFirestoreLoading(true);
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (user.email === import.meta.env.VITE_ADMIN_MAILID) {
        localStorage.setItem("userType", "admin");
        setUserType("admin");
        setIsFirestoreLoading(false);
        navigate("/admin/home");
      } else if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          gender: "",
          dob: "",
          userId: user.uid,
        });
        localStorage.setItem("autoLogin", "true");
        localStorage.setItem("userType", "new");
        localStorage.setItem("toastShown", "false");
        setUserType("new");
        setIsFirestoreLoading(false);
        navigate("/createprofile/details");
      } else {
        localStorage.setItem("autoLogin", "true");
        localStorage.setItem("userType", "old");
        localStorage.setItem("toastShown", "false");
        setUserType("old");
        setIsFirestoreLoading(false);
        navigate("/app/home");
      }
    } catch (error) {
      console.error("Error during Google login", error);
      setIsFirestoreLoading(false);
    }
  };

  if (isFirestoreLoading) {
    return <UniversalLoader />;
  }

  return (
    <div className="flex items-center justify-center flex-col w-full h-svh">
      <h1 className="text-5xl max-md:text-3xl text-textcolor font-bold my-10">
        Welcome To Dhun
      </h1>
      <button
        className="flex gap-5 text-xl border-2 border-primary py-3 px-5 rounded-xl text-textcolor"
        onClick={handleGoogleLogin}
      >
        <UilGoogle size="30" color="white" />
        Login with Google
      </button>
    </div>
  );
};

export default AuthLogin;
