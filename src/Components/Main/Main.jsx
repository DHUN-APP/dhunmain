import React, {useState} from 'react'
import Home from '../Home/Home'
import '../../App.css'
import { useNavigate } from 'react-router-dom';
import Settings from '../Settings/Settings';
import MyProfile from '../MyProfile/MyProfile';
import Search from '../Search/Search';
import Notifications from '../Notifications/Notifications';
import ProPlan from '../ProPlan/ProPlan';
import AddSong from '../MySong/AddSong';
import SongDetails from '../MySong/SongDetails';
import { useParams } from 'react-router-dom';
import EditInfo from '../MyProfile/EditInfo';

const Main = ({section, userType, setUserType, songId, setSongId}) => {

  const navigate = useNavigate();

    const renderComponent = () => {
        switch (section) {
          case "home":
            return <Home userType={userType} setUserType={setUserType} />;
          case "search":
            return <Search/>
          case "myprofile":
            return <MyProfile setSongId={setSongId}/>
          case "song":
            return <SongDetails songId={songId}/>
          case "addsong":
            return <AddSong/>
          case "notifications":
            return <Notifications/>
          case "settings":
            return <Settings/>
          case "proplan":
            return <ProPlan/>
          case "editinfo":
            return <EditInfo/>
          default:
            return <Home userType={userType} setUserType={setUserType} />;
        }
      };

  return (
    <div>
        {renderComponent()}
    </div>
  )
}

export default Main