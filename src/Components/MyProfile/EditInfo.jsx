import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import { BsPencilSquare } from "react-icons/bs";
import { useAuth } from "../../Context/AuthContext";
import { db, storage } from "../../../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import UniversalLoader from "../Loaders/UniversalLoader";
import { toast } from "react-toastify";

const EditInfo = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [userData, setUserData] = useState({
    name: "",
    dob: "",
    gender: "",
    photoURL: "",
  });
  const [newPhoto, setNewPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log("No such document!");
      }
      setIsLoading(false);
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setNewPhoto(e.target.files[0]);
      const newPhotoURL = URL.createObjectURL(e.target.files[0]);
      setUserData((prev) => ({ ...prev, photoURL: newPhotoURL }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (newPhoto) {
        const photoRef = ref(
          storage,
          `profilephoto/${userId}/${userId}_profilephoto.png`
        );
        await uploadBytes(photoRef, newPhoto);
        const photoURL = await getDownloadURL(photoRef);
        await updateDoc(doc(db, "users", userId), { photoURL });
        setUserData((prev) => ({ ...prev, photoURL }));
      }
      await updateDoc(doc(db, "users", userId), {
        name: userData.name,
        dob: userData.dob,
        gender: userData.gender,
      });
      toast.success("Profile updated successfully.", {
        position: "top-center",
      });
      navigate("/app/myprofile");
    } catch (error) {
      toast.error(`Error updating document: ${error}`, {
        position: "top-center",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <UniversalLoader />
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center p-5">
      <div className="absolute top-5 left-5 p-0 m-0">
        <div
          onClick={() => navigate("/app/myprofile")}
          className="cursor-pointer"
        >
          <TiArrowBack size={40} className="text-white" />
        </div>
      </div>
      <div className="text-3xl text-textcolor font-bold mb-5">Edit Info</div>
      <div className="flex flex-col items-center w-full max-w-md border-2 p-5 rounded-lg border-textcolor">
        <div className="relative mb-5">
          <img
            src={userData.photoURL}
            alt="Profile"
            className="rounded-full h-32 w-32 object-cover"
          />
          <label className="absolute bottom-2 right-2 cursor-pointer">
            <BsPencilSquare
              size={24}
              className="text-white bg-blue-500 rounded-full p-1"
            />
            <input
              type="file"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        </div>
        <div className="w-full mb-5">
          <h1 className="text-xl text-textcolor font-semibold mb-1">Name:</h1>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="outline-none rounded-lg px-3 py-1 w-full border border-textcolor"
          />
        </div>
        <div className="w-full mb-5">
          <h1 className="text-xl text-textcolor font-semibold mb-1">DOB:</h1>
          <div className="relative">
            <input
              type="date"
              name="dob"
              value={userData.dob}
              onChange={handleInputChange}
              className="outline-none rounded-lg px-3 py-1 w-full border border-textcolor text-black appearance-none"
              min="1920-01-01"
              max={today}
              required
            />
            <div className="absolute top-1/2 transform -translate-y-1/2 left-3 pointer-events-none">
              <span className="text-black font-semibold">
                {userData.dob === "" ? "DOB" : userData.dob}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full mb-5">
          <h1 className="text-xl text-textcolor font-semibold mb-1">Gender:</h1>
          <select
            name="gender"
            value={userData.gender}
            onChange={handleInputChange}
            className="outline-none rounded-lg px-3 py-1 w-full border border-textcolor"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button
          onClick={handleSave}
          className="text-2xl w-full font-semibold rounded-lg px-5 py-2 bg-textcolor text-primarybg flex items-center justify-center mb-2"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default EditInfo;
