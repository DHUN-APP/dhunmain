import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../../Context/AuthContext";
import UniversalLoader from "../Loaders/UniversalLoader";

const PersonalDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [name, setFirstName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.name);
        }
      } catch (e) {
        console.error("Error fetching user data: ", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const userDocRef = doc(db, "users", userId);
      await setDoc(
        userDocRef,
        {
          name,
          dob,
          gender,
          dislikes: [],
          likes: [],
          myplaylists: [],
          mysongs: [],
          createdOn: new Date().toISOString(),
          updatedOn: new Date().toISOString(),
        },
        { merge: true }
      );
      navigate("/createprofile/genres");
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  if (isLoading) {
    return <UniversalLoader />;
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl text-textcolor font-bold mb-5">
        Enter Personal Details
      </h1>
      <form
        className="flex flex-col items-center w-[300px] max-md:w-[80%] border-2 p-5 rounded-lg border-textcolor mt-8"
        onSubmit={handleSubmit}
      >
        <h1 className="w-full flex justify-start mb-1 text-textcolor text-xl font-semibold">
          Name :
        </h1>
        <input
          type="text"
          placeholder="Name"
          className="outline-none rounded-lg px-3 py-1 w-full font-semibold"
          value={name}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <h1 className="w-full flex justify-start mb-1 mt-5 text-textcolor text-xl font-semibold">
          DOB :
        </h1>
        <div className="relative w-full">
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="outline-none rounded-lg px-3 py-1 w-full text-black appearance-none font-semibold"
            min="1920-01-01"
            max={today}
            required
          />
          <div className="absolute top-1/2 transform -translate-y-1/2 left-3 pointer-events-none">
            <span className="text-black font-semibold">
              {dob === "" ? "DOB" : `${dob}`}
            </span>
          </div>
        </div>
        <h1 className="w-full flex justify-start mb-1 mt-5 text-textcolor text-xl font-semibold">
          Gender :
        </h1>
        <select
          className="outline-none rounded-lg px-3 py-1 w-full font-semibold"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          {" "}
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <button
          type="submit"
          className="text-2xl w-full font-semibold  rounded-lg px-5 py-1 mt-10 bg-textcolor text-primarybg"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default PersonalDetails;
