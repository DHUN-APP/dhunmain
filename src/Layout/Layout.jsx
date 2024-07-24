import React from 'react'
import { useParams } from 'react-router-dom'
import TopNav from '../Components/TopNav/TopNav'
import Sidebar from '../Components/Sidebar/Sidebar'
import Main from '../Components/Main/Main'
import BottomNav from '../Components/BottomNav/BottomNav'

const Layout = ({userType, setUserType}) => {

  const {section} = useParams();

  return (
      <div className='flex'>
            <Sidebar/>
            <div className='w-full'>
              <TopNav/>
              <Main section={section} userType={userType} setUserType={setUserType}/>
              <BottomNav/>
            </div>
      </div> 
  )
}

export default Layout