import React from 'react'
import { useParams } from 'react-router-dom';
import AdminHome from './Components/Home/AdminHome'
import NavBar from './Components/NavBar/NavBar';
import { ManageUsers } from './Components/ManageUser/ManageUsers';
import ManageArtists from './Components/ManageArtist/ManageArtists';
import ManagePlaylists from './Components/ManagePlaylist/ManagePlaylists';

const AdminMain = () => {

  const {section} = useParams();

  const renderComponent = () => {
    switch (section) {
      case "home":
        return <AdminHome/>;
      case "manageuser":
        return <ManageUsers />;
      case "manageartist":
        return <ManageArtists/>
      case "manageplaylist":
        return <ManagePlaylists/>
      default:
        return <AdminHome />;
    }
  };


  return (
    <div className='flex flex-col'>
        <NavBar/>
        {renderComponent()}
    </div>
  )
}

export default AdminMain






