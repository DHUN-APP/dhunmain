import React from 'react'
import { useParams } from 'react-router-dom'
import TopNav from '../Components/TopNav/TopNav'
import Sidebar from '../Components/Sidebar/Sidebar'
import Main from '../Components/Main/Main'
import BottomNav from '../Components/BottomNav/BottomNav'

import '../index.css'

const Layout = ({userType, setUserType}) => {

  const {section} = useParams();

  // return (
  //   <div className="flex">
  //     <Sidebar />
  //     <div className="flex flex-col"> {/* Main content area */}
  //       <TopNav />
  //       <Main section={section} userType={userType} setUserType={setUserType} />
  //       <BottomNav />
  //     </div>
  //   </div>
  // )

  return (
    <div className="w-full flex">
    <div className='w-1/4 max-md:hidden h-screen sticky top-0'>
    <Sidebar />
    </div>
      <div className="md:w-3/4 flex flex-col rounded-lg max-md:w-full h-screen md:py-4">
        <TopNav />
        <div className='flex-grow overflow-auto hide-scrollbar md:bg-slate-800 rounded-b-lg scrollbar-hide'><Main section={section} userType={userType} setUserType={setUserType} /></div>
        <BottomNav />
      </div>
    </div>
  );
  
}

export default Layout

