/**
 * Searchbar React component.  
 * 
 * by Fred de Laszlo 
 * 15-OCT-2024 
 */
import React, { useState } from 'react';
import './SearchBar.css';

/**
 * Create a searchbar input component.
 * @param {Object} - onFind callback extracted from props. 
 * @returns HTML code for the searchbar.
 */
function SearchBar({onFind}) {
    const [text, setText] = useState('');

    /**
     * Handle text changes in the searchbar input.
     * @param {Object} e - event object.
     */
    const handleChange = (e) => {
        setText(e.target.value);
    };

    /**
     * Button click handler, calls parent callback/
     */
    function handleClick() {
        onFind(text);
    }

    /**
     * Simulate button click if user hits return key.
     * @param {Object} e - event object 
     */
    function handleKeyDown(e) {
        if(e.code === 'Enter') { 
            handleClick();
         }
    }

    return (
        <div className='searchbar'>
            <input type='text' value={text} placeholder="Enter Artist/Song/Album" onChange={handleChange} onKeyDown={handleKeyDown}/>
            &nbsp;
            <button type='button' onClick={handleClick}>Search</button> 
        </div>
    );
}

export default SearchBar;