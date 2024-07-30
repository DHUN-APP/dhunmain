import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const MusicPlayer = () => {
    const iframeRef = useRef(null);
    const [embedController, setEmbedController] = useState(null);
    const [player, setPlayer] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Fetch Spotify access token
        const fetchToken = async () => {
            try {
                const tokenResponse = await axios('https://accounts.spotify.com/api/token', {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + btoa(`${import.meta.env.VITE_SPOTIFY_ID}:${import.meta.env.VITE_SPOTIFY_SECRET}`)
                    },
                    data: 'grant_type=client_credentials',
                    method: 'POST'
                });

                setToken(tokenResponse.data.access_token);
            } catch (error) {
                console.error('Error fetching Spotify token:', error);
            }
        };

        fetchToken();
    }, []);

    useEffect(() => {
        if (!token) return;

        // Define the Spotify iFrame API readiness callback
        window.onSpotifyIframeApiReady = (IFrameAPI) => {
            const element = iframeRef.current;
            const options = {
                uri: 'spotify:track:3xMHXmedL5Rvfxmiar9Ryv', // Replace with your Spotify URI
                width: 300,
                height: 380
            };
            const callback = (controller) => {
                setEmbedController(controller);

                // Event listeners
                controller.addListener('ready', () => {
                    console.log('The Embed has initialized');
                });

                controller.addListener('playback_update', (e) => {
                    document.getElementById('progressTimestamp').innerText = `${parseInt(e.data.position / 1000, 10)} s`;
                });
            };
            IFrameAPI.createController(element, options, callback);
        };

        // Load Spotify iFrame SDK
        const iframeScript = document.createElement('script');
        iframeScript.src = 'https://sdk.scdn.co/spotify-player.js';
        iframeScript.onload = () => {
            console.log('Spotify iFrame API loaded');
        };
        document.body.appendChild(iframeScript);

        return () => {
            document.body.removeChild(iframeScript);
        };
    }, [token]);

    useEffect(() => {
        if (!token) return;

        // Define the Spotify Web Playback SDK readiness callback
        window.onSpotifyWebPlaybackSDKReady = () => {
            const playerInstance = new Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(token); }
            });

            // Error handling
            playerInstance.addListener('initialization_error', e => console.error(e));
            playerInstance.addListener('authentication_error', e => console.error(e));
            playerInstance.addListener('account_error', e => console.error(e));
            playerInstance.addListener('playback_error', e => console.error(e));

            // Playback status updates
            playerInstance.addListener('player_state_changed', state => console.log(state));

            // Ready
            playerInstance.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setPlayer(playerInstance);
            });

            // Not Ready
            playerInstance.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            // Connect to the player!
            playerInstance.connect();
        };

        // Load Spotify Web Playback SDK
        const webPlaybackScript = document.createElement('script');
        webPlaybackScript.src = 'https://sdk.scdn.co/spotify-player.js';
        webPlaybackScript.onload = () => {
            console.log('Spotify Web Playback SDK loaded');
        };
        document.body.appendChild(webPlaybackScript);

        return () => {
            document.body.removeChild(webPlaybackScript);
        };
    }, [token]);

    const play = () => {
        if (player) {
            player.togglePlay().then(() => {
                console.log('Toggled play state');
            }).catch(e => console.error(e));
        }
    };

    const pause = () => {
        if (player) {
            player.pause().then(() => {
                console.log('Playback paused');
            }).catch(e => console.error(e));
        }
    };

    const seek = () => {
        if (player) {
            player.seek(30 * 1000).then(() => { // Seek to 30 seconds
                console.log('Seeked to 30 seconds');
            }).catch(e => console.error(e));
        }
    };

    return (
        <div className="w-full h-screen flex flex-col items-center p-4 bg-gray-100">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Spotify Player Example</h1>
            <div
                id="embed-iframe"
                ref={iframeRef}
                className="bg-white shadow-lg rounded-lg overflow-hidden w-80 h-96"
            ></div>
            <div id="controls" className="flex flex-wrap justify-center gap-4 mt-6">
                <button
                    onClick={play}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                >
                    Play
                </button>
                <button
                    onClick={pause}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                >
                    Pause
                </button>
                <button
                    onClick={seek}
                    className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 transition"
                >
                    Seek to 30s
                </button>
            </div>
            <div id="progress" className="mt-6 text-gray-700">
                <p>Playback Position: <span id="progressTimestamp">0 s</span></p>
            </div>
        </div>
    );
};

export default MusicPlayer;
