import { useEffect, useState } from 'react';
import './App.css';
import CreatePlaylist from './Components/CreatePlaylist';
import YouTube from './Components/YouTube';
import SpotifyAuth from './Components/SpotifyAuth';

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [spotifyPlaylistId, setSpotifyPlaylistId] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [authenticated, setAuthenticated] = useState(false); // New state to track authentication

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const data = await response.json();
        setUserName(data.display_name);
        setUserId(data.id);
        setAuthenticated(true); 
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (accessToken) {
      fetchUserProfile();
    }
  }, [accessToken]);
  
  const handleLogout = () => {
    setAccessToken("");
    window.localStorage.removeItem("token");
    window.location.reload(); 
  };

  return (
    <div>
      {!authenticated && <SpotifyAuth onAccessToken={setAccessToken} />}
      {authenticated && (
        <div>
          <div className="header-container">
              <h1 className='appHeading'>Hii {userName}</h1>
              <button onClick={handleLogout}>Logout</button>
          </div>
          <CreatePlaylist accessToken={accessToken} setPlaylistId={setSpotifyPlaylistId} user_id={userId} />
          <YouTube ACCESS_TOKEN={accessToken} spotifyPlaylistId={spotifyPlaylistId} />
          
        </div>
      )}
    </div>
  );
}

export default App;
