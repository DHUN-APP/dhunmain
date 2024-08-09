import React from "react";
import { useNavigate } from "react-router-dom";
import Home from "../Home/Home";
import Search from "../Search/Search";
import MyProfile from "../MyProfile/MyProfile";
import SongDetails from "../MySong/SongDetails";
import AddSong from "../MySong/AddSong";
import EditSong from "../MySong/EditSong";
import Notifications from "../Notifications/Notifications";
import Settings from "../Settings/Settings";
import ProPlan from "../ProPlan/ProPlan";
import EditInfo from "../MyProfile/EditInfo";
import PlaylistDetails from "../MyPlaylist/PlaylistDetails";
import AddPlaylist from "../MyPlaylist/AddPlaylist";
import EditPlaylist from "../MyPlaylist/EditPlaylist";
import FollowingDetails from "../MyFollowings/FollowingDetails";
import Song_Details from "../MyFollowings/Song_Details";
import GlobalPlaylistDetails from "../MyPlaylist/GlobalPlaylistDetails";

const Main = ({
  section,
  userType,
  setUserType,
  songId,
  setSongId,
  playlistId,
  setPlaylistId,
  artistId,
  setArtistId,
}) => {
  const navigate = useNavigate();

  const renderComponent = () => {
    switch (section) {
      case "home":
        return (
          <Home
            userType={userType}
            setUserType={setUserType}
            setArtistId={setArtistId}
            setPlaylistId={setPlaylistId}
          />
        );
      case "search":
        return <Search />;
      case "myprofile":
        return (
          <MyProfile
            setSongId={setSongId}
            setPlaylistId={setPlaylistId}
            setArtistId={setArtistId}
          />
        );
      case "song":
        return <SongDetails songId={songId} />;
      case "addsong":
        return <AddSong />;
      case "editsong":
        return <EditSong songId={songId} />;
      case "notifications":
        return <Notifications />;
      case "settings":
        return <Settings />;
      case "proplan":
        return <ProPlan />;
      case "editinfo":
        return <EditInfo />;
      case "playlist":
        return (
          <PlaylistDetails playlistId={playlistId} setSongId={setSongId} />
        );
      case "globalplaylist":
        return (
          <GlobalPlaylistDetails
            playlistId={playlistId}
            setSongId={setSongId}
            setArtistId={setArtistId}
          />
        );
      case "addplaylist":
        return <AddPlaylist />;
      case "editplaylist":
        return <EditPlaylist playlistId={playlistId} />;
      case "followingdetails":
        return <FollowingDetails artistId={artistId} setSongId={setSongId} />;
      case "songdetails":
        return <Song_Details artistId={artistId} songId={songId} />;
      default:
        return <Home userType={userType} setUserType={setUserType} />;
    }
  };

  return <div>{renderComponent()}</div>;
};

export default Main;
