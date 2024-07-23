import React from 'react'

const LocalLoader = () => {
  return (
    <div className='h-screen w-full flex justify-center items-center '>
    <div class='flex space-x-2 justify-center items-center  h-screen '>
        <span class='sr-only'>Loading...</span>
        <div class='h-5 w-5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
        <div class='h-5 w-5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
        <div class='h-5 w-5 bg-white rounded-full animate-bounce'></div>
    </div>
    </div>

  )
}

export default LocalLoader
