import React, {useState }  from 'react';
import '../Stylesheets/CreatePlaylist.css';

const CreatePlaylist = ({ accessToken, setPlaylistId, user_id}) => {
    const [playlistName, setPlaylistName] = useState('');

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
                    throw new Error('Unauthorized: Invalid or expired access token');
                }
                throw new Error('Failed to create playlist');
            }
            const data = await response.json();
            setPlaylistId(data.id);
            alert('Playlist created successfully:', data);
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };

    return (
        <div className='container'>
            <div className='create'>
                <h2>Create Customized Playlist</h2>
                <p>Choose the name of your spotify playlist</p>
                <input type="text" placeholder='Enter your playlist name' value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} />
                <button onClick={handleCreatePlaylist}>Create Playlist</button>
            </div>
        </div>
    );
};

export default CreatePlaylist;
