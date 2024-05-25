import React, { useEffect, useState } from 'react';
import '../Stylesheets/youtube.css';

export default function YouTube({ ACCESS_TOKEN, spotifyPlaylistId}) {
    const [videoTitles, setVideoTitles] = useState([]);

    const [playlistId, setPlaylistId] = useState('');

    const handleInputChange = (event) => {
      setPlaylistId(event.target.value);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      setPlaylistId(event.target.value);
      console.log(event.target.value);
    };

    const apiKey = 'AIzaSyCbt3yKNrZ_ProvwkeDp7WhCzSUhiSualc';
    const maxResults = 25;
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${apiKey}`;
  
    useEffect(() => {
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const titles = data.items.map(item => item.snippet.title);
          setVideoTitles(titles);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, [apiUrl]);
    
    const handleAdd = async (title) => {
      try {
        // Search for the song on Spotify
        const searchResponse = await fetch(`https://api.spotify.com/v1/search?query=${encodeURIComponent(title)}&type=track&limit=1`, {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
          },
        });
  
        if (!searchResponse.ok) {
          throw new Error('Failed to search for the track on Spotify');
        }
  
        const searchData = await searchResponse.json();
        const track = searchData.tracks.items[0];
  
        if (!track) {
          throw new Error('No track found on Spotify');
        }
  
        const songId = track.id;
        console.log(`Found track: ${title} with ID: ${songId}`);

        // Add the song to the Spotify playlist
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
            throw new Error('Failed to add the track to the Spotify playlist');
          }

          alert(`Added track ${title} to the playlist successfully`);
        } catch (error) {
          console.error('Error adding track to the playlist:', error);
        }
      };
      
      

    return (
      <div className='container-youtube'>
        <div className='youtube'>
          <h1>Data From YouTube playlist</h1>
          <input 
            type="text" 
            value={playlistId} 
            onChange={handleInputChange} 
            placeholder="Enter YouTube PlaylistID" 
          />
          <button onSubmit={() => handleSubmit()} type="submit">Submit</button>
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
