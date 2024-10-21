/**
 * Tracklist React component.  
 * 
 * by Fred de Laszlo 
 * 15-OCT-2024 
 */
import React from 'react';
import Track from '../Track/Track';
import './Tracklist.css';

/**
 * React component for a list of tracks in a play list.
 * @param {Object} - playlist array and onRemoveClick callback extracted from props. 
 * @returns HTML code with track elements.
 */
function Tracklist({playList, onRemoveTrack}) {

    /**
     * Create an app wide unique key
     * @param {Number} item - number to create a unique key 
     * @returns {String} - a unique key
     */
    function makeKey(item) {
        return `tracklist${item}`;
    }

    return (
        <div className='tracklist'>
            {playList.map((track, index) => (
                <Track track={track} playList={playList} index={index} onRemoveTrack={onRemoveTrack} key={makeKey(index)}/>
            ))}
            
        </div>
    );
}

export default Tracklist;