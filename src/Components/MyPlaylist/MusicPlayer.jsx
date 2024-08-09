import React, { useState, useEffect, useRef } from "react";

import { FaRegCirclePlay, FaRegCirclePause } from "react-icons/fa6";
import { TbRewindBackward10, TbRewindForward10 } from "react-icons/tb";
import { RxLoop } from "react-icons/rx";
import {
  BiSolidVolumeMute,
  BiSolidVolumeFull,
  BiSolidVolumeLow,
} from "react-icons/bi";
import { VscDebugRestart } from "react-icons/vsc";

const MusicPlayer = ({ songs, initialSongIndex = 0 }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(initialSongIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSong?.fileUrl || "";
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      audioRef.current.loop = isLooping;
      setDuration(audioRef.current.duration);

      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("ended", handleSongEnd);

      return () => {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        audioRef.current.removeEventListener("ended", handleSongEnd);
      };
    }
  }, [currentSong, volume, isMuted, isLooping]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
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
    if (!isLooping && currentSongIndex < songs.length - 1) {
      setCurrentSongIndex((prevIndex) => prevIndex + 1);
    }
  };

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
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const playSelectedSong = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-wrap py-5 mx-5 rounded-lg bg-slate-900">
      <audio ref={audioRef} />
      <div className="w-1/3 flex flex-col items-center justify-center max-md:w-full">
        <h1 className="text-2xl font-bold mb-4 text-white">Now Playing</h1>
        {currentSong && (
          <div className="bg-white p-4 rounded shadow-md w-full">
            <img
              src={currentSong.coverImgUrl || "default-cover.jpg"}
              alt={currentSong.title}
              className="w-full h-48 object-cover rounded-md"
            />
            <h2 className="text-xl font-semibold mt-2">{currentSong.title}</h2>
            <p className="text-sm text-gray-700">By {currentSong.artist}</p>
          </div>
        )}
        <div className="px-5 py-2 rounded-full flex items-center justify-center w-full mt-4">
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
          <span className="text-white ml-2">
            -{formatTime(duration - currentTime)}
          </span>
        </div>
      </div>

      <div className="flex flex-col w-1/3 items-center justify-center space-y-5 max-md:w-full">
        <div className="flex space-x-5">
          <button onClick={toggleLoop}>
            {isLooping ? (
              <RxLoop size={30} className="text-white" />
            ) : (
              <RxLoop size={30} className="text-gray-500" />
            )}
          </button>
          <button onClick={handleBackward}>
            <TbRewindBackward10 size={40} className="text-white" />
          </button>
          <button onClick={togglePlayPause}>
            {isPlaying ? (
              <FaRegCirclePause size={50} className="text-white" />
            ) : (
              <FaRegCirclePlay size={50} className="text-white" />
            )}
          </button>
          <button onClick={handleForward}>
            <TbRewindForward10 size={40} className="text-white" />
          </button>
          <button onClick={handleRestart}>
            <VscDebugRestart size={30} className="text-white" />
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={toggleMute}>
            {isMuted ? (
              <BiSolidVolumeMute size={30} className="text-white" />
            ) : volume > 0.5 ? (
              <BiSolidVolumeFull size={30} className="text-white" />
            ) : (
              <BiSolidVolumeLow size={30} className="text-white" />
            )}
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

      <div className="w-1/3 max-md:w-full">
        <h2 className="text-xl font-semibold text-white mb-2">Playlist</h2>
        <ul className="space-y-2">
          {songs.map((song, index) => (
            <li
              key={song.id}
              className="bg-white p-4 rounded shadow-md flex items-center justify-between cursor-pointer hover:bg-gray-200"
              onClick={() => playSelectedSong(index)}
            >
              <span>{song.title}</span>
              {currentSongIndex === index && isPlaying && (
                <span className="text-green-500">Playing</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MusicPlayer;
