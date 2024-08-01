// import React, { useState, useEffect } from 'react';
// import { FaRegCirclePlay } from "react-icons/fa6";
// import { FaRegCirclePause } from "react-icons/fa6";
// import { TbRewindBackward10,TbRewindForward10 } from "react-icons/tb";
// import { RxLoop } from "react-icons/rx";
// import { BiSolidVolumeMute } from "react-icons/bi";
// import { BiSolidVolumeFull } from "react-icons/bi";
// import { VscDebugRestart } from "react-icons/vsc";
// import { BiSolidVolumeLow } from "react-icons/bi";

// const MusicPlayer = ({ songFileUrl, audioRef, onLoadedMetadata }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [volume, setVolume] = useState(1); 
//   const [isLooping, setIsLooping] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   const togglePlayPause = () => {
//     if (audioRef.current.paused) {
//       audioRef.current.play();
//       setIsPlaying(true);
//     } else {
//       audioRef.current.pause();
//       setIsPlaying(false);
//     }
//   };

//   const handleRestart = () => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = 0;
//       if (!audioRef.current.paused) {
//         audioRef.current.play();
//       }
//     }
//   };

//   const handleForward = () => {
//     if (audioRef.current) {
//       audioRef.current.currentTime += 10;
//     }
//   };

//   const handleBackward = () => {
//     if (audioRef.current) {
//       audioRef.current.currentTime -= 10;
//     }
//   };

//   const toggleMute = () => {
//     if (audioRef.current) {
//       setIsMuted(!isMuted);
//       audioRef.current.muted = !isMuted;
//     }
//   };

//   const handleVolumeChange = (e) => {
//     const newVolume = parseFloat(e.target.value);
//     setVolume(newVolume);
//     if (audioRef.current) {
//       audioRef.current.volume = newVolume;
//     }
//   };

//   const toggleLoop = () => {
//     if (audioRef.current) {
//       setIsLooping(!isLooping);
//       audioRef.current.loop = !isLooping;
//     }
//   };

//   const handleTimeUpdate = () => {
//     if (audioRef.current) {
//       setCurrentTime(audioRef.current.currentTime);
//     }
//   };

//   useEffect(() => {
//     if (audioRef.current) {
//       setDuration(audioRef.current.duration);
//       audioRef.current.volume = volume;
//       audioRef.current.muted = isMuted;
//       audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
//       audioRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
//       return () => {
//         audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
//         audioRef.current.removeEventListener('loadedmetadata', onLoadedMetadata);
//       };
//     }
//   }, [volume, isMuted, onLoadedMetadata]);

//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   return (

//     <div className="w-full flex">

//       <audio ref={audioRef} src={songFileUrl} />

//       <div className='w-1/3 flex items-center justify-end'>
//         <div className=' px-5 py-2 rounded-full flex items-center justify-center w-full '>
//         <span className="text-white mr-2">{formatTime(currentTime)}</span>
//           <input
//             type="range"
//             min="0"
//             max={duration || 0}
//             value={currentTime}
//             onChange={(e) => {
//               if (audioRef.current) {
//                 audioRef.current.currentTime = e.target.value;
//                 setCurrentTime(e.target.value);
//               }
//             }}
//             className="w-full slider"
//           />
//           <span className="text-white ml-2">-{formatTime(duration - currentTime)}</span>

//         </div>
//       </div>
 


//       <div className='flex w-1/3 justify-center items-center space-x-5'>
//       <button onClick={toggleLoop}>
//           {isLooping ? <RxLoop size={30} className='text-textcolor' /> : <RxLoop size={30} className='text-gray-500' />}
//         </button>
//       <button onClick={handleBackward}><TbRewindBackward10 size={40} className='text-textcolor' /></button>
//         <button onClick={togglePlayPause} className="">
//           {isPlaying ? <FaRegCirclePause size={50} className='text-textcolor' /> : <FaRegCirclePlay size={50} className='text-textcolor' />}
//         </button>
//         <button onClick={handleForward}><TbRewindForward10 size={40} className='text-textcolor' /></button>
//         <button onClick={handleRestart} ><VscDebugRestart size={30} className='text-textcolor'/></button>

//       </div>


//       <div className='w-1/3 flex items-center'>
//         <div className=' px-5 py-2 rounded-full flex items-center justify-center'>
//         <button onClick={toggleMute} >
//           {isMuted ? <BiSolidVolumeMute size={30} className='text-textcolor' /> : <BiSolidVolumeFull size={30} className='text-textcolor' /> }
//         </button>
//         <input
//           type="range"
//           min="0"
//           max="1"
//           step="0.01"
//           value={volume}
//           onChange={handleVolumeChange}
//           className="w-full slider"
//         />
//         </div>
//       </div>


//       </div>
//   );
// };

// export default MusicPlayer;



import React, { useState, useEffect } from 'react';
import { FaRegCirclePlay, FaRegCirclePause } from 'react-icons/fa6';
import { TbRewindBackward10, TbRewindForward10 } from 'react-icons/tb';
import { RxLoop } from 'react-icons/rx';
import { BiSolidVolumeMute, BiSolidVolumeFull, BiSolidVolumeLow } from 'react-icons/bi';
import { VscDebugRestart } from 'react-icons/vsc';

const MusicPlayer = ({ songFileUrl, audioRef, onLoadedMetadata }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1); 
  const [isLooping, setIsLooping] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (!audioRef.current.paused) {
        audioRef.current.play();
      }
    }
  };

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
    }
  };

  const handleBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      setIsMuted(!isMuted);
      audioRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleLoop = () => {
    if (audioRef.current) {
      setIsLooping(!isLooping);
      audioRef.current.loop = !isLooping;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSongEnd = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  


  useEffect(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
      audioRef.current.addEventListener('ended', handleSongEnd);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('loadedmetadata', onLoadedMetadata);
          audioRef.current.removeEventListener('ended', handleSongEnd);
        }
      };
    }
  }, [volume, isMuted, onLoadedMetadata]);
  

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className=" flex-wrap flex py-5 mx-5 rounded-lg md:mt-10 bg-slate-900 max-md:flex-col">
      <audio ref={audioRef} src={songFileUrl} />
      <div className='w-1/3 flex items-center justify-end max-md:w-full'>
        <div className='px-5 py-2 rounded-full flex items-center justify-center w-full'>
          <span className="text-white mr-2">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => {
              if (audioRef.current) {
                audioRef.current.currentTime = e.target.value;
                setCurrentTime(e.target.value);
              }
            }}
            className="w-full"
          />
          <span className="text-white ml-2">-{formatTime(duration - currentTime)}</span>
        </div>
      </div>

      <div className='flex w-1/3 justify-center items-center space-x-5 max-md:w-full max-md:my-2'>
        <button onClick={toggleLoop}>
          {isLooping ? <RxLoop size={30} className='text-textcolor' /> : <RxLoop size={30} className='text-gray-500' />}
        </button>
        <button onClick={handleBackward}><TbRewindBackward10 size={40} className='text-textcolor' /></button>
        <button onClick={togglePlayPause}>
          {isPlaying ? <FaRegCirclePause size={50} className='text-textcolor' /> : <FaRegCirclePlay size={50} className='text-textcolor' />}
        </button>
        <button onClick={handleForward}><TbRewindForward10 size={40} className='text-textcolor' /></button>
        <button onClick={handleRestart}><VscDebugRestart size={30} className='text-textcolor' /></button>
      </div>

      <div className='w-1/3 flex justify-center items-center max-md:w-full'>
        <button onClick={toggleMute}>
          {isMuted ? <BiSolidVolumeMute size={30} className='text-textcolor' /> : (volume > 0.5 ? <BiSolidVolumeFull size={30} className='text-textcolor' /> : <BiSolidVolumeLow size={30} className='text-textcolor' />)}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="w-1/2"
          disabled={isMuted}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
