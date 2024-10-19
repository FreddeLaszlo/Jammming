/**
 * Animated background React component.  
 * 
 * by Fred de Laszlo 
 * 15-OCT-2024 
 */
import React from 'react';
import BackgroundChar from './BackgroundChar/BackgroundChar';
import './Background.css';

/**
 * React component to create an animated background
 * @param {Object} {numChars} - extracted from object, defaults to 20.  
 * @returns 
 */
function Background({ numChars = 20 }) {

    const dummyArray = [...Array(numChars).keys()]; // dummy array to enable use of map function.

    return (
        <div id="background" aria-hidden="true">
            {dummyArray.map((num) => <BackgroundChar id={num} key={`backgroundchar${num}`}/>)}
        </div>
    );
}

export default Background;