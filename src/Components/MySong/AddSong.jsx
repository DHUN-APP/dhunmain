import React, { useState } from "react";
import { storage, db } from "../../../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";

const AddSong = () => {
  const [songName, setSongName] = useState("");
  const [singer, setSinger] = useState("");
  const [coverImg, setCoverImg] = useState(null);
  const [songFile, setSongFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [coverImgProgress, setCoverImgProgress] = useState(0);
  const [coverImgUploadedBytes, setCoverImgUploadedBytes] = useState(0);
  const [coverImgTotalBytes, setCoverImgTotalBytes] = useState(0);
  const [songFileProgress, setSongFileProgress] = useState(0);
  const [songFileUploadedBytes, setSongFileUploadedBytes] = useState(0);
  const [songFileTotalBytes, setSongFileTotalBytes] = useState(0);
  const { userId } = useAuth();
  const navigate = useNavigate();

  // const handleUpload = async (e) => {
  //   e.preventDefault();
  //   if (!songName || !singer || !coverImg || !songFile) {
  //     alert("All fields are required!");
  //     return;
  //   }

  //   setUploading(true);

  //   try {
  //     const timestamp = Date.now();
  //     const coverImgName = `${userId}_cover_${timestamp}`;
  //     const songFileName = `${userId}_song_${timestamp}`;
  //     const songId = `${userId}_${timestamp}`;

  //     const coverImgRef = ref(storage, `coverImg/${userId}/${coverImgName}`);
  //     const coverImgUploadTask = uploadBytesResumable(coverImgRef, coverImg);
  //     coverImgUploadTask.on("state_changed", (snapshot) => {
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       setCoverImgProgress(progress);
  //       setCoverImgUploadedBytes(snapshot.bytesTransferred);
  //       setCoverImgTotalBytes(snapshot.totalBytes);
  //     });

  //     await coverImgUploadTask;
  //     const coverImgUrl = await getDownloadURL(coverImgRef);

  //     const songFileRef = ref(storage, `songs/${userId}/${songFileName}`);
  //     const songFileUploadTask = uploadBytesResumable(songFileRef, songFile);
  //     songFileUploadTask.on("state_changed", (snapshot) => {
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       setSongFileProgress(progress);
  //       setSongFileUploadedBytes(snapshot.bytesTransferred);
  //       setSongFileTotalBytes(snapshot.totalBytes);
  //     });

  //     await songFileUploadTask;
  //     const songFileUrl = await getDownloadURL(songFileRef);

  //     const userDocRef = doc(db, "users", userId);
  //     const userDocSnapshot = await getDoc(userDocRef);

  //     if (userDocSnapshot.exists()) {
  //       await updateDoc(userDocRef, {
  //         mysongs: arrayUnion({
  //           songId,
  //           songName,
  //           singer,
  //           coverImgUrl,
  //           songFileUrl,
  //           views: 0,
  //           shares: 0,
  //           likes:[],
  //           dislikes:[],
  //           createdOn: new Date().toISOString(),
  //           updatedOn: new Date().toISOString(),
  //         }),
  //       });
  //     } else {
  //       console.error("User document does not exist");
  //     }

  //     setUploading(false);
  //     toast.success("Song uploaded successfully", {
  //       position: "top-center",
  //       toastId: "welcome-toast",
  //     });
  //     setSongName("");
  //     setSinger("");
  //     setCoverImg(null);
  //     setSongFile(null);
  //     setCoverImgProgress(0);
  //     setSongFileProgress(0);
  //     setCoverImgUploadedBytes(0);
  //     setCoverImgTotalBytes(0);
  //     setSongFileUploadedBytes(0);
  //     setSongFileTotalBytes(0);
  //     navigate("/app/myprofile");
  //   } catch (error) {
  //     setUploading(false);
  //     console.error("Error uploading song:", error);
  //     alert("Error uploading song. Please try again.");
  //   }
  // };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!songName || !singer || !coverImg || !songFile) {
      alert("All fields are required!");
      return;
    }
  
    setUploading(true);
  
    try {
      const timestamp = Date.now();
      const coverImgName = `${userId}_cover_${timestamp}`;
      const songFileName = `${userId}_song_${timestamp}`;
      const songId = `${userId}_${timestamp}`;
  
      const coverImgRef = ref(storage, `coverImg/${userId}/${coverImgName}`);
      const coverImgUploadTask = uploadBytesResumable(coverImgRef, coverImg);
      coverImgUploadTask.on("state_changed", (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setCoverImgProgress(progress);
        setCoverImgUploadedBytes(snapshot.bytesTransferred);
        setCoverImgTotalBytes(snapshot.totalBytes);
      });
  
      await coverImgUploadTask;
      const coverImgUrl = await getDownloadURL(coverImgRef);
  
      const songFileRef = ref(storage, `songs/${userId}/${songFileName}`);
      const songFileUploadTask = uploadBytesResumable(songFileRef, songFile);
      songFileUploadTask.on("state_changed", (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setSongFileProgress(progress);
        setSongFileUploadedBytes(snapshot.bytesTransferred);
        setSongFileTotalBytes(snapshot.totalBytes);
      });
  
      await songFileUploadTask;
      const songUrl = await getDownloadURL(songFileRef);
  
      const songData = {
        songId,
        songName,
        singer,
        coverImgUrl,
        songUrl,
        views: 0,
        shares: 0,
        likes: [],
        dislikes: [],
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
      };
  
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        await updateDoc(userDocRef, {
          mysongs: arrayUnion(songData),
        });
      } else {
        console.error("User document does not exist");
      }
  
      setUploading(false);
      toast.success("Song uploaded successfully", {
        position: "top-center",
        toastId: "welcome-toast",
      });
      setSongName("");
      setSinger("");
      setCoverImg(null);
      setSongFile(null);
      setCoverImgProgress(0);
      setSongFileProgress(0);
      setCoverImgUploadedBytes(0);
      setSongFileUploadedBytes(0);
      setCoverImgTotalBytes(0);
      setSongFileTotalBytes(0);
      navigate("/app/myprofile");
    } catch (error) {
      setUploading(false);
      console.error("Error uploading song:", error);
      alert("Error uploading song. Please try again.");
    }
  };
  

  return (
    <div className="p-5">
      <div className="mb-3 flex">
        <div onClick={() => navigate("/app/myprofile")}>
          <TiArrowBack size={40} color="white" />
        </div>
      </div>
      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <h1 className="text-xl text-textcolor font-semibold">Song Name :</h1>
        <input
          type="text"
          placeholder="Enter Song Name..."
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
          className="p-2 outline-none rounded-lg bg-slate-600 text-white text-lg font-semibold"
          required
        />
        <h1 className="text-xl text-textcolor font-semibold">Singer Name :</h1>
        <input
          type="text"
          placeholder="Enter Singer Name..."
          value={singer}
          onChange={(e) => setSinger(e.target.value)}
          className="p-2 outline-none rounded-lg bg-slate-600 text-white text-lg font-semibold"
          required
        />
        <h1 className="text-xl text-textcolor font-semibold">
          Upload Cover image :
        </h1>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverImg(e.target.files[0])}
          className="p-2 outline-none rounded-lg bg-slate-600 text-white text-lg font-semibold"
          required
        />
        {uploading && (
          <div className="flex items-center">
            <progress
              value={coverImgProgress}
              max="100"
              className="rounded-lg overflow-hidden"
            />
            <span className="ml-2 text-lg text-textcolor font-medium">
              ({coverImgProgress.toFixed(2)}%) Uploaded
            </span>
          </div>
        )}
        <h1 className="text-xl text-textcolor font-semibold">Upload Song :</h1>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setSongFile(e.target.files[0])}
          className="p-2 outline-none rounded-lg bg-slate-600 text-white text-lg font-semibold"
          required
        />
        {uploading && (
          <div className="flex items-center">
            <progress
              value={songFileProgress}
              max="100"
              className="rounded-lg overflow-hidden"
            />
            <span className="ml-2 text-lg text-textcolor font-medium">
              ({songFileProgress.toFixed(2)}%) Uploaded
            </span>
          </div>
        )}
        <button
          type="submit"
          className="p-2 bg-slate-300 mt-4 text-slate-900 text-lg font-bold rounded"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Song"}
        </button>
      </form>
    </div>
  );
};

export default AddSong;
