
import React from "react";
import { useNavigate } from "react-router-dom";
import { PiSmileySad } from "react-icons/pi";
import { IoMusicalNote } from "react-icons/io5";
import { TbPlaylist } from "react-icons/tb";
import { IoPerson } from "react-icons/io5";

const Search = ({
  searchTerm,
  setSearchTerm,
  playlists,
  songs,
  popularPlaylists,
  popularArtists,
  closeModal,
}) => {
  const navigate = useNavigate();

  const filteredArtists = popularArtists.filter((artist) =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const filteredSongs = songs.filter((song) =>
    song.songName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPopularPlaylists = popularPlaylists.filter((playlist) =>
    playlist.playlistName.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const filteredPopularSongs = popularArtists.flatMap((artist) =>
    artist.songs.filter((artistSong) =>
      artistSong.songName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="cursor-pointer flex flex-col">

        {filteredSongs.length > 0 && (
          <div>
          <div className="text-2xl font-semibold text-white flex items-center space-x-2 my-2"><IoMusicalNote /><h2>My Songs</h2></div>
          <ul className="list-disc pl-5 mb-4 flex flex-wrap">
            {filteredSongs.map((song, index) => (
              <li
                key={index}
                className="bg-slate-700 flex items-center space-x-3 p-2 rounded-md  overflow-hidden m-1"
                onClick={() => {
                  const artistId = popularArtists.find((artist) =>
                    artist.songs.some((s) => s.songId === song.songId)
                  )?.artistId;

                  setSearchTerm("");
                  navigate(`/app/songdetails?t=m&s=${song.songId}`);
                  closeModal();
                }}
              >
                <img
                  src={song.coverImgUrl}
                  alt=""
                  className="h-12 w-12 rounded-md"
                />
                <h2 className="text-xl text-white  truncate">
                  {song.songName}
                </h2>
              </li>
            ))}
          </ul>
          </div>
        )}


        {playlists.length > 0 && (
          <div className="flex flex-col">
          <div className="text-2xl font-semibold text-white flex items-center space-x-2 my-2"><TbPlaylist /><h2>My Playlists</h2></div>
          <ul className="list-disc pl-5 mb-4 flex flex-wrap">
            {playlists.map((playlist, index) => (
              <li
                key={index}
                className="bg-slate-700 flex items-center space-x-3 p-2 rounded-md  overflow-hidden m-1"
                onClick={() => {
                  setSearchTerm("");
                  navigate(
                    `/app/playlist?t=myplaylist&p=${playlist.playlistId}`
                  );
                  closeModal();
                }}
              >
                <img
                  src={playlist.coverImgUrl}
                  alt=""
                  className="h-12 w-12 rounded-md"
                />
                <h2 className="text-xl text-white  truncate">
                  {playlist.playlistName}
                </h2>
              </li>
            ))}
          </ul>
          </div>
        )}


        {filteredPopularSongs.length > 0 && (
            <div className="flex flex-col">
            <div className="text-2xl font-semibold text-white flex items-center space-x-2 my-2"><IoMusicalNote /><h2>Popular Songs</h2></div>
            <ul className="list-disc pl-5 mb-4 flex flex-wrap">
              {filteredPopularSongs.map((song, index) => (
                <li
                  key={index}
                  className="bg-slate-700 flex items-center space-x-3 p-2 rounded-md  overflow-hidden m-1"
                  onClick={() => {
                    const artistId = popularArtists.find((artist) =>
                      artist.songs.some((s) => s.songId === song.songId)
                    )?.artistId;
                    setSearchTerm("");
                    navigate(
                      `/app/songdetails?t=a&a=${artistId}&s=${song.songId}`
                    );
                    closeModal();
                  }}
                >
                  <img
                    src={song.coverImgUrl}
                    alt=""
                    className="h-12 w-12 rounded-md"
                  />
                  <h2 className="text-xl text-white  truncate">
                    {song.songName}
                  </h2>
                </li>
              ))}
            </ul>
            </div>
          )}

          {filteredPopularPlaylists.length > 0 && (
          <div className="flex flex-col">
          <div className="text-2xl font-semibold text-white flex items-center space-x-2 my-2"><TbPlaylist /><h2>Popular Playlists</h2></div>
          <ul className="list-disc pl-5 mb-4 flex flex-wrap">
            {filteredPopularPlaylists.map((playlist, index) => (
              <li
                key={index}
                className="bg-slate-700 flex items-center space-x-3 p-2 rounded-md  overflow-hidden m-1"
                onClick={() => {
                  setSearchTerm("");
                  navigate(
                    `/app/playlist?t=externalplaylist&p=${playlist.playlistId}`
                  );
                  closeModal();
                }}
              >
                <img
                  src={playlist.coverImgUrl}
                  alt=""
                  className="h-12 w-12 rounded-md"
                />
                <h2 className="text-xl text-white  truncate">
                  {playlist.playlistName}
                </h2>
              </li>
            ))}
          </ul>
          </div>
        )}


        {filteredArtists.length > 0 && (
          <div className="flex flex-col">
          <div className="text-2xl font-semibold text-white flex items-center space-x-2 my-2"> <IoPerson /><h2>Popular Artists</h2></div>
          <ul className="list-disc pl-5 mb-4 flex flex-wrap">
            {filteredArtists.map((artist, index) => (
              <li
                key={index}
                className="bg-slate-700 flex items-center space-x-3 p-2 rounded-md  overflow-hidden m-1"
                onClick={() => {
                  setSearchTerm("");
                  navigate(`/app/followingdetails?a=${artist.artistId}`);
                  closeModal();
                }}
              >
                <img
                  src={artist.photoURL}
                  alt=""
                  className="h-12 w-12 rounded-md"
                />
                <h2 className="text-xl text-white  truncate">
                  {artist.name}
                </h2>
              </li>
            ))}
          </ul>
          </div>
        )}

        {(filteredSongs.length+playlists.length+filteredPopularSongs.length+filteredPopularPlaylists.length+filteredArtists.length)===0 && (
          <div className="flex space-x-2 items-center text-textcolor w-full justify-center h-full py-40">
          <PiSmileySad size={40} />
          <h1 className="flex items-center text-2xl font-semibold">No result found...</h1>
          </div>
        )}

    </div>
  );
};

export default Search;
