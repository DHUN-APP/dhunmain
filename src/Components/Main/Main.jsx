import React from 'react'
import Home from '../Home/Home'

const Main = ({section, userType, setUserType}) => {

    const renderComponent = () => {
        switch (section) {
          case "home":
            return <Home userType={userType} setUserType={setUserType} />;
          default:
            return <Home userType={userType} setUserType={setUserType} />;
        }
      };

  return (
    <div className='text-white text-xl font-bold md:ml-[300px] overflow-y-scroll'>
        {renderComponent()}
    </div>
  )
}

export default Main