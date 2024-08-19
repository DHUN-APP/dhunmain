import React, { useState, useEffect } from "react";
import { FaRegCirclePlay, FaRegCirclePause } from "react-icons/fa6";
import { TbRewindBackward10, TbRewindForward10 } from "react-icons/tb";
import { RxLoop } from "react-icons/rx";
import {
  BiSolidVolumeMute,
  BiSolidVolumeFull,
  BiSolidVolumeLow,
} from "react-icons/bi";
import { VscDebugRestart } from "react-icons/vsc";
import { MdSpeed } from "react-icons/md";

const MusicPlayer = ({ songFileUrl, audioRef, onLoadedMetadata }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);


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
        audioRef.current.playbackRate = playbackRate;
        audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.addEventListener("loadedmetadata", onLoadedMetadata);
        audioRef.current.addEventListener("ended", handleSongEnd);
        return () => {
            if (audioRef.current) {
            audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
            audioRef.current.removeEventListener(
                "loadedmetadata",
                onLoadedMetadata
            );
            audioRef.current.removeEventListener("ended", handleSongEnd);
            }
        };
        }
    }, [volume, playbackRate, onLoadedMetadata]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="mb-16 flex-wrap flex py-5 max-md:py-2  md:mt-10 bg-slate-900 max-md:flex-col md:px-5 mx-5 space-y-4 max-md:space-y-3 rounded-lg">
      <audio ref={audioRef} src={songFileUrl} />

      <div className="px-5 md:py-2 rounded-full flex items-center justify-center w-full">
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
      
      <div className="w-1/3 flex items-center justify-end max-md:hidden">

              <button>
              {volume===0 ? (
                  <BiSolidVolumeMute size={30} className="text-textcolor" />
              ) : volume > 0.5 ? (
                  <BiSolidVolumeFull size={30} className="text-textcolor" />
              ) : (
                  <BiSolidVolumeLow size={30} className="text-textcolor" />
              )}
              </button>
              <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              />
      </div>

      <div className="flex w-1/3 justify-center items-center space-x-5 max-md:w-full max-md:my-2">
        <button onClick={toggleLoop}>
          {isLooping ? (
            <RxLoop size={30} className="text-textcolor" />
          ) : (
            <RxLoop size={30} className="text-gray-500" />
          )}
        </button>
        <button onClick={handleBackward}>
          <TbRewindBackward10 size={40} className="text-textcolor" />
        </button>
        <button onClick={togglePlayPause}>
          {isPlaying ? (
            <FaRegCirclePause size={50} className="text-textcolor" />
          ) : (
            <FaRegCirclePlay size={50} className="text-textcolor" />
          )}
        </button>
        <button onClick={handleForward}>
          <TbRewindForward10 size={40} className="text-textcolor" />
        </button>
        <button onClick={handleRestart}>
          <VscDebugRestart size={30} className="text-textcolor" />
        </button>
      </div>

      <div className="md:hidden flex items-center justify-center w-full">

        <button>
        {volume===0 ? (
            <BiSolidVolumeMute size={30} className="text-textcolor" />
        ) : volume > 0.5 ? (
            <BiSolidVolumeFull size={30} className="text-textcolor" />
        ) : (
            <BiSolidVolumeLow size={30} className="text-textcolor" />
        )}
        </button>
        <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handleVolumeChange}
        />
      </div>


        <div className="w-1/3 flex justify-start max-md:justify-center items-center max-md:w-full space-x-3">
            <MdSpeed size={30} className="text-textcolor" />
                <select
                      value={playbackRate}
                      onChange={(e) => {
                        const selectedRate = e.target.value;
                        if (selectedRate === "advanced") {
                          setIsAdvancedMode(true);
                        } else {
                          setIsAdvancedMode(false);
                          setPlaybackRate(parseFloat(selectedRate));
                          audioRef.current.playbackRate = parseFloat(selectedRate);
                        }
                      }}
                      className="p-1 outline-none rounded-md text-textcolor bg-slate-700"
                    >
                      <option value="0.25">0.25x</option>
                      <option value="0.5">0.5x</option>
                      <option value="1">1x</option>
                      <option value="2">2x</option>
                      <option value="4">4x</option>
                      <option value="advanced">Advanced</option>
                    </select>

                    {isAdvancedMode && (
                      <div className="flex items-center">
                        <input
                          type="range"
                          min="0.25"
                          max="4"
                          step="0.01"
                          value={playbackRate}
                          onChange={(e) => {
                            const newRate = parseFloat(e.target.value);
                            setPlaybackRate(newRate);
                            audioRef.current.playbackRate = newRate;
                          }}
                          className=""
                        />
                        <span className="text-white ml-2">{playbackRate.toFixed(2)}x</span>
                      </div>
                    )}
            
                </div>

        

        


      </div>

  );
};

export default MusicPlayer;

