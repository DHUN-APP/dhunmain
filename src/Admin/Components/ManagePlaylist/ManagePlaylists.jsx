import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import CreatePlaylist from "./CreatePlaylist";
import EditPlaylist from "./EditPlaylist";
import AddSong from "./AddSong";
import RemoveSong from "./RemoveSong";
import RemovePlaylist from "./RemovePlaylist";

const ManagePlaylists = () => {
  const [section, setSection] = useState("createplaylist");
  const navigate = useNavigate();

  const renderComponent = () => {
    switch (section) {
      case "createplaylist":
        return <CreatePlaylist />;
      case "editplaylist":
        return <EditPlaylist />;
      case "removeplaylist":
        return <RemovePlaylist />;
      case "addsong":
        return <AddSong />;
      case "removesong":
        return <RemoveSong />;
      default:
        return <CreatePlaylist />;
    }
  };

  return (
    <div className="flex flex-col w-full my-10">
      <div className="mb-3 px-5 flex">
        <div onClick={() => navigate("/admin/home")}>
          <TiArrowBack size={40} color="white" />
        </div>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <div
          className={`h-16 w-44 flex items-center justify-center rounded-lg text-xl font-bold  cursor-pointer ${
            section === "createplaylist"
              ? "bg-primarycolor text-slate-900"
              : "bg-slate-700 text-slate-400"
          }`}
          onClick={() => setSection("createplaylist")}
        >
          New Playlist
        </div>
        <div
          className={`h-16 w-44 flex items-center justify-center rounded-lg text-xl font-bold cursor-pointer ${
            section === "editplaylist"
              ? "bg-primarycolor text-slate-900"
              : "bg-slate-700 text-slate-400"
          }`}
          onClick={() => setSection("editplaylist")}
        >
          Edit Playlist
        </div>
        <div
          className={`h-16 w-44 flex items-center justify-center rounded-lg text-xl font-bold cursor-pointer ${
            section === "removeplaylist"
              ? "bg-primarycolor text-slate-900"
              : "bg-slate-700 text-slate-400"
          }`}
          onClick={() => setSection("removeplaylist")}
        >
          Remove Playlist
        </div>
        <div
          className={`h-16 w-44 flex items-center justify-center rounded-lg text-xl font-bold cursor-pointer ${
            section === "addsong"
              ? "bg-primarycolor text-slate-900"
              : "bg-slate-700 text-slate-400"
          }`}
          onClick={() => setSection("addsong")}
        >
          Add Song
        </div>
        <div
          className={`h-16 w-44 flex items-center justify-center rounded-lg text-xl font-bold cursor-pointer ${
            section === "removesong"
              ? "bg-primarycolor text-slate-900"
              : "bg-slate-700 text-slate-400"
          }`}
          onClick={() => setSection("removesong")}
        >
          Remove Song
        </div>
      </div>

      <div className="flex justify-center">{renderComponent()}</div>
    </div>
  );
};

export default ManagePlaylists;
