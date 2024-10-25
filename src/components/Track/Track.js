/**
 * Track React component.  
 * 
 * by Fred de Laszlo 
 * 15-OCT-2024 
 */
import React from "react";
import './Track.css';

/**
 * Create HTML code for a single track
 * @param {Object} - track, index, onAddTrack and onRemoveTrack from props 
 * @returns HTML code fro a track.
 */
function Track({ track, index, onAddTrack, onRemoveTrack = null }) {

    /**
     * Handle add to playlist button click
     */
    function handleAddClick() {
        onAddTrack(track);
    }

    /**
     * Handle remove from playlist button click
     * @param {Object} e - event object 
     */
    function handleRemoveClick(e) {
        onRemoveTrack(e.target.id);
    }

    /**
     * Returns a button element with add OR remove text on button,
     * depending on wether track is in search results or play list.
     * @returns A button element with add or remove text.
     */
    function addOrRemove() {
        if (onRemoveTrack === null) {
            return <button className="button" onClick={handleAddClick} id={index} key={index}>Add</button>;
        } else {
            return <button className="button" onClick={handleRemoveClick} id={index} key={index}>Remove</button>;
        }
    }

    function inPlayList() {
        if(onRemoveTrack === null) {
            return track.inPlaylist ? 'track inplaylist' : 'track';
        }
        return 'track';
    }


    return (
        <div className={inPlayList()}>
            <div>
                <div><span className="trackDetail">Title:</span> {track.title}</div>
                <div><span className="trackDetail">Artist:</span> {track.artist}</div>
                <div><span className="trackDetail">Album:</span> {track.album}</div>
                <div className="buttons">
                    {addOrRemove()}
                </div>
            </div>
        </div>
    );
}

export default Track;