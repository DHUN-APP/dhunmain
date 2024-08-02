import React from 'react'
import Home from '../Home/Home'
import '../../App.css'
import Settings from '../Settings/Settings';
import MyProfile from '../MyProfile/MyProfile';
import Search from '../Search/Search';
import Notifications from '../Notifications/Notifications';
import ProPlan from '../ProPlan/ProPlan';

const Main = ({section, userType, setUserType}) => {

    const renderComponent = () => {
        switch (section) {
          case "home":
            return <Home userType={userType} setUserType={setUserType} />;
          case "search":
            return <Search/>
          case "myprofile":
            return <MyProfile />
          case "notifications":
            return <Notifications/>
          case "settings":
            return <Settings/>
          case "proplan":
            return <ProPlan/>
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