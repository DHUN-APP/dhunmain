import React from "react";
import Home from "../Home/Home";
import MyProfile from "../MyProfile/MyProfile";
import AddSong from "../MySong/AddSong";
import EditSong from "../MySong/EditSong";
import Notifications from "../Notifications/Notifications";
import Settings from "../Settings/Settings";
import ProPlan from "../ProPlan/ProPlan";
import EditInfo from "../MyProfile/EditInfo";
import PlaylistDetails from "../Playlist/PlaylistDetails";
import AddPlaylist from "../MyPlaylist/AddPlaylist";
import EditPlaylist from "../MyPlaylist/EditPlaylist";
import FollowingDetails from "../MyFollowings/FollowingDetails";
import SongDetails from "../Music/SongDetails";
import GlobalPlaylistDetails from "../MyPlaylist/GlobalPlaylistDetails";
import MobileSearch from "../Search/MobileSearch";

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
        return <MobileSearch/>
      case "myprofile":
        return (
          <MyProfile
            setSongId={setSongId}
            setPlaylistId={setPlaylistId}
            setArtistId={setArtistId}
          />
        );
      case "addsong":
        return <AddSong />;
      case "editsong":
        return <EditSong/>;
      case "notifications":
        return <Notifications />;
      case "settings":
        return <Settings />;
      case "proplan":
        return <ProPlan />;
      case "editinfo":
        return <EditInfo />;
      case "playlist":
        return <PlaylistDetails/>;
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
        return <EditPlaylist/>;
      case "followingdetails":
        return <FollowingDetails/>;
      case "songdetails":
        return <SongDetails/>;
      default:
        return <Home userType={userType} setUserType={setUserType} />;
    }
  };

  return <div>{renderComponent()}</div>;
};

export default Main;
