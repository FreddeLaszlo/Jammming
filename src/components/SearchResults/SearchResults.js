/**
 * Search results React component.  
 * 
 * by Fred de Laszlo 
 * 15-OCT-2024 
 */
import React from 'react';
import Track from '../Track/Track';
import './SearchResults.css';

/**
 * React component to display a list of track results.
 * @param {Object} - searchResults array and onAddTrack callback handler 
 * @returns HTML code with a list of tracks.
 */
function SearchResults({ searchResults, onAddTrack, page = 1, numPages = 1, onPageRequest }) {
    /**
     * Handle add track to playlist event
     * @param {Object} track - details of track 
     */
    function handleAddNewTrack(track) {
        onAddTrack(track);
    }

    /**
     * Create an app wide unique key
     * @param {Number} item - number to create a unique key 
     * @returns {String} - a unique key
     */
    function makeKey(item) {
        return `searchresult${item}`;
    }

    function firstPage() {
        onPageRequest(1);
    }

    function previousPage() {
        const newPage = page > 1 ? page -1 : 1;
        onPageRequest(newPage); 
    }

    function nextPage() {
        const newPage = page < numPages ? page + 1 : numPages;
        onPageRequest(newPage);
    }

    return (
        <div className='searchResult'>
            <div>
                <h2>Search Results</h2>
                <div className='pages'>
                    <button onClick={firstPage}>&lt;&lt;</button>
                    <button onClick={previousPage}>&lt;</button>
                    Page {page} of {numPages}
                    <button onClick={nextPage}>&gt;</button>
                </div>
                <div className='results'>
                    {searchResults.map((track, index) => (
                        <Track track={track} onAddTrack={handleAddNewTrack} key={makeKey(index)}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchResults;