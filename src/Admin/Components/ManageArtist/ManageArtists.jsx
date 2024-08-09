import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import CreateAritst from "./CreateAritst";
import EditArtist from "./EditArtist";
import AddSong from "./AddSong";
import RemoveSong from "./RemoveSong";
import EditSong from "./EditSong";
import RemoveArtist from "./RemoveArtist";

const ManageArtists = () => {
  const [section, setSection] = useState("createartist");
  const navigate = useNavigate();

  const renderComponent = () => {
    switch (section) {
      case "createartist":
        return <CreateAritst />;
      case "editartist":
        return <EditArtist />;
      case "removeartist":
        return <RemoveArtist />;
      case "addsong":
        return <AddSong />;
      case "editsong":
        return <EditSong />;
      case "removesong":
        return <RemoveSong />;
      default:
        return <CreateAritst />;
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
          className={`h-16 w-36 flex items-center justify-center rounded-lg text-xl font-bold  cursor-pointer ${
            section === "createartist"
              ? "bg-primarycolor text-slate-900"
              : "bg-slate-700 text-slate-400"
          }`}
          onClick={() => setSection("createartist")}
        >
          New Artist
        </div>
        <div
          className={`h-16 w-36 flex items-center justify-center rounded-lg text-xl font-bold cursor-pointer ${
            section === "editartist"
              ? "bg-primarycolor text-slate-900"
              : "bg-slate-700 text-slate-400"
          }`}
          onClick={() => setSection("editartist")}
        >
          Edit Artist
        </div>
        <div
          className={`h-16 w-36 flex items-center justify-center rounded-lg text-xl font-bold cursor-pointer ${
            section === "removeartist"
              ? "bg-primarycolor text-slate-900"
              : "bg-slate-700 text-slate-400"
          }`}
          onClick={() => setSection("removeartist")}
        >
          Remove Artist
        </div>
        <div
          className={`h-16 w-36 flex items-center justify-center rounded-lg text-xl font-bold cursor-pointer ${
            section === "addsong"
              ? "bg-primarycolor text-slate-900"
              : "bg-slate-700 text-slate-400"
          }`}
          onClick={() => setSection("addsong")}
        >
          New Song
        </div>
        <div
          className={`h-16 w-36 flex items-center justify-center rounded-lg text-xl font-bold cursor-pointer ${
            section === "editsong"
              ? "bg-primarycolor text-slate-900"
              : "bg-slate-700 text-slate-400"
          }`}
          onClick={() => setSection("editsong")}
        >
          Edit Song
        </div>
        <div
          className={`h-16 w-36 flex items-center justify-center rounded-lg text-xl font-bold cursor-pointer ${
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

export default ManageArtists;
