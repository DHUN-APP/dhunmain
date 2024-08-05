import React from 'react';
import { useNavigate } from 'react-router-dom';
import Home from '../Home/Home';
import Search from '../Search/Search';
import MyProfile from '../MyProfile/MyProfile';
import SongDetails from '../MySong/SongDetails';
import AddSong from '../MySong/AddSong';
import EditSong from '../MySong/EditSong';
import Notifications from '../Notifications/Notifications';
import Settings from '../Settings/Settings';
import ProPlan from '../ProPlan/ProPlan';
import EditInfo from '../MyProfile/EditInfo';
import PlaylistDetails from '../MyPlaylist/PlaylistDetails';
import AddPlaylist from '../MyPlaylist/AddPlaylist';
import EditPlaylist from '../MyPlaylist/EditPlaylist';

const Main = ({ section, userType, setUserType, songId, setSongId, playlistId, setPlaylistId }) => {
  const navigate = useNavigate();

  const renderComponent = () => {
    switch (section) {
      case "home":
        return <Home userType={userType} setUserType={setUserType} />;
      case "search":
        return <Search />;
      case "myprofile":
        return <MyProfile setSongId={setSongId} setPlaylistId={setPlaylistId} />;
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
        return <PlaylistDetails playlistId={playlistId} />;
      case "addplaylist":
        return <AddPlaylist />;
      case "editplaylist":
        return <EditPlaylist playlistId={playlistId} />;
      default:
        return <Home userType={userType} setUserType={setUserType} />;
    }
  };

  return <div>{renderComponent()}</div>;
};

export default Main;
