/**
 * Playlist React component.  
 * 
 * by Fred de Laszlo 
 * 15-OCT-2024 
 */
import React, { useState } from 'react';
import './Playlist.css';

/**
 * React component to create an input with save and clear buttons for playlist
 * @param {Object} - onClearList and onSaveList callbacks 
 * @returns playlist HTML
 */
function Playlist({ onClearList, onSaveList, disableButtons=null }) {
    const [playlistName, setPlaylistName] = useState([]);

    /**
     * Handle input element text changes
     * @param {Object} e - the event object 
     */
    function handleChange(e) {
        setPlaylistName(e.target.value);
    }

    /**
     * Handle clear list button clicks.
     * Calls parent callback handler
     */
    function handleClickSaveList() {
        onSaveList(playlistName);
    }

    return (
        <div className='playlistHeader'>
            <input type='text' placeholder='Enter playlist name' value={playlistName} onChange={handleChange} />

            <button onClick={onClearList} disabled={disableButtons}>Clear</button>
            <button onClick={handleClickSaveList} disabled={disableButtons}>Save</button>
        </div>
    );
}

export default Playlist;