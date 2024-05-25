import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../Stylesheets/CreatePlaylist.css';

const CreatePlaylist = ({ accessToken, setPlaylistId, user_id }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylists, setShowPlaylists] = useState(false);

  const handleCreatePlaylist = async () => {
    const playlistParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
      body: JSON.stringify({
        name: playlistName,
        description: 'This playlist is created using your YouTube playlist',
        public: false
      })
    };

    try {
      const response = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, playlistParameters);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or expired access token, login once again');
        }
        throw new Error('Failed to create playlist');
      }
      const data = await response.json();
      setPlaylistId(data.id);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Playlist created successfully',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Network error!! Try again',
        showConfirmButton: false,
        timer: 2500
      });
    }
  };

  const handleGetPlaylists = async () => {
    const getPlaylistParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
    };

    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50&offset=0', getPlaylistParameters);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or expired access token, login once again');
        }
        throw new Error('Failed to fetch playlists');
      }
      const data = await response.json();
      setPlaylists(data.items);
      setShowPlaylists(true);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Playlists fetched successfully',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Network error!! Try again',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const handleSelectPlaylist = (playlistId) => {
    setPlaylistId(playlistId);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Playlist selected successfully',
      showConfirmButton: false,
      timer: 1500
    });
  };

  return (
    <div className='container'>
      <div className='create'>
        <h2>Create a new playlist</h2>
        <p>Choose the name of your Spotify playlist</p>
        <input
          type="text"
          placeholder='Enter your playlist name'
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
        />
        <button onClick={handleCreatePlaylist}>Create Playlist</button>
      </div>

      <hr className='divider' />

      <div className='getPlayList'>
        <h2>Add to an existing playlist?</h2>
        <button onClick={handleGetPlaylists}>Get all Playlists</button>
      
        {showPlaylists && (
          <div className='playlists'>
            <h3>Choose the playlist</h3>
            <ul>
              {playlists.map((playlist) => (
                <li key={playlist.id}>
                  {playlist.name}
                  <button onClick={() => handleSelectPlaylist(playlist.id)}>Select</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePlaylist;
