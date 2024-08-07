import React from 'react'
import MyInfo from './MyInfo'
import Myplaylists from '../MyPlaylist/Myplaylists'
import MyFollowings from '../MyFollowings/MyFollowings'
import MySongs from '../MySong/MySongs'


const MyProfile = ({setSongId,setPlaylistId}) => {
  return (
    <div className='mt-5 w-full flex flex-col mb-16'>
      <MyInfo/>
      <div className=' w-full flex justify-center'><hr className="h-1 w-[95%] my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr></div>
      <MySongs setSongId={setSongId}/>
      <div className=' w-full flex justify-center'><hr className="h-1 w-[95%] my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr></div>
      <Myplaylists setPlaylistId={setPlaylistId}/>
      <div className=' w-full flex justify-center'><hr className="h-1 w-[95%] my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr></div>
      <MyFollowings/>
    </div>
  )
}

export default MyProfile