import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../Stylesheets/youtube.css';

export default function YouTube({ ACCESS_TOKEN, spotifyPlaylistId }) {
  const [videoTitles, setVideoTitles] = useState([]);
  const [playlistId, setPlaylistId] = useState('');

  const extractPlaylistId = (url) => {
    const match = url.match(/(?:list=)([^&]+)/);
    return match ? match[1] : '';
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    const extractedPlaylistId = extractPlaylistId(inputValue);
    setPlaylistId(extractedPlaylistId);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form default submission
    const apiKey = 'AIzaSyCbt3yKNrZ_ProvwkeDp7WhCzSUhiSualc';
    const maxResults = 25;
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${apiKey}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const titles = data.items.map(item => item.snippet.title);
        setVideoTitles(titles);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Videos fetched successfully',
          showConfirmButton: false,
          timer: 2000
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Failed to fetch your playlist',
          showConfirmButton: false,
          timer: 2500
        });
      });
  };

  const handleAdd = async (title) => {
    try {
      const searchResponse = await fetch(`https://api.spotify.com/v1/search?query=${encodeURIComponent(title)}&type=track&limit=1`, {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
        },
      });

      if (!searchResponse.ok) {
        console.error('Search request failed:', searchResponse.statusText);
        throw new Error('Choose the track before adding song');
      }

      const searchData = await searchResponse.json();
      const track = searchData.tracks.items[0];

      if (!track) {
        console.error('No track found for:', title);
        throw new Error('No track found on Spotify');
      }

      const songId = track.id;
      console.log(`Found track: ${title} with ID: ${songId}`);

      const addTrackResponse = await fetch(`https://api.spotify.com/v1/playlists/${spotifyPlaylistId}/tracks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: [`spotify:track:${songId}`],
        }),
      });

      if (!addTrackResponse.ok) {
        console.error('Add track request failed:', addTrackResponse.statusText);
        throw new Error('Choose the track before adding song');
      }

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Added track ${title} to the playlist`,
        showConfirmButton: false,
        timer: 1000
      });
    } catch (error) {
      console.error('Error adding track:', error.message || error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error: ' + error.message,
        showConfirmButton: false,
        timer: 2500
      });
    }
  };

  return (
    <div className='container-youtube'>
      <div className='youtube'>
        <h1>Data From YouTube playlist</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={playlistId}
            onChange={handleInputChange}
            placeholder="Enter YouTube Playlist URL or ID"
          />
          <button type="submit">Submit</button>
        </form>
        <ul>
          {videoTitles.map((title, index) => (
            <li key={index}>
              {title}
              <button onClick={() => handleAdd(title)}>Add</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
