import React, { useState } from "react";
import { useParams } from "react-router-dom";
import TopNav from "../Components/TopNav/TopNav";
import Sidebar from "../Components/Sidebar/Sidebar";
import Main from "../Components/Main/Main";
import BottomNav from "../Components/BottomNav/BottomNav";

import "../index.css";

const Layout = ({ userType, setUserType }) => {
  const { section } = useParams();
  const [songId, setSongId] = useState(null);
  const [playlistId, setPlaylistId] = useState(null);
  const [artistId, setArtistId] = useState(null);

  return (
    <div className="w-full flex">
      <div className="w-1/4 max-md:hidden h-screen sticky top-0">
        <Sidebar setSongId={setSongId} setPlaylistId={setPlaylistId} />
      </div>
      <div className="md:w-3/4 flex flex-col rounded-lg max-md:w-full h-screen md:py-4">
        <TopNav />
        <div className="flex-grow overflow-auto hide-scrollbar md:bg-slate-800 rounded-b-lg scrollbar-hide">
          <Main
            section={section}
            userType={userType}
            setUserType={setUserType}
            songId={songId}
            setSongId={setSongId}
            playlistId={playlistId}
            setPlaylistId={setPlaylistId}
            artistId={artistId}
            setArtistId={setArtistId}
          />
        </div>
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
