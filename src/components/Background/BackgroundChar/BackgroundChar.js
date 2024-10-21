/**
 * Background character React component.  
 * 
 * by Fred de Laszlo 
 * 15-OCT-2024 
 */
import React, { useState, useEffect } from 'react';
import spotifyLogo1 from './Spotify_Primary_Logo_RGB_Green.png';
import spotifyLogo2 from './Spotify_Primary_Logo_RGB_White.png';
import './BackgroundChar.css';

// Characters to animate. These include music symbols
// and Spotify images. 
const entities = [
    '\u2606', '\u262E', '\u2640',
    '\u2642', '\u2669', '\u266A', '\u266B',
    '\u266C', '\u266D', '\u266E', '\u266F', 
    'logo'
];

/**
 * Randomly select an entity.
 * @returns {String} - A single character from entities array.
 */
function randomEntity() {
    const char =  entities[Math.floor(Math.random() * entities.length)];
    return char === 'logo' ? <Logo /> : char;
}

// Array of CSS animations.
const animations = ['backgroundAnimation1', 'backgroundAnimation2'];

/**
 * Randomly select a CSS animation
 * @returns {String} - A CSS animation name.
 */
function randomAnimation() {
    return animations[Math.floor(Math.random() * animations.length)];
}

/**
 * Randomly create an rgba colour. 
 * @returns {String} - A random (pastel) and opacity in rgba() format.
 */
function randomRGBA() {
    const r = Math.floor(Math.random() * 128 + 127);
    const g = Math.floor(Math.random() * 128 + 127);
    const b = Math.floor(Math.random() * 128 + 127);
    const a = Math.random() * (1 - 0.7) + 0.7;
    return `rgba(${r},${g},${b},${a})`;
}

/**
 * Randomly set color, size and start position attributes of a character.
 * @returns {Object} - random character attributes
 */
function randomBackground() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const x = Math.floor(Math.random() * vw);
    const y = -150;
    const fontSize = Math.random() * 128 + 20;
    return {
        color: randomRGBA(),
        left: `${x}px`,
        top: `${y}px`,
        fontSize: `${fontSize}px`,
    };
}

/**
 * React component to randomly create an entity from images. 
 * @param {Object} {width} - width of image extracted from object.
 * @returns 
 */
function Logo() {
    const logos = [spotifyLogo1, spotifyLogo2];
    const logo = logos[Math.floor(Math.random() * logos.length)];
    const width = Math.random() * 128 + 20;
    return <img src={logo} alt='O' width={width} />;
}

/**
 * React component to randomly create and animate a character.
 * @param {Object} {id} - id extracted from object. 
 * @returns An animated character.
 */
export default function BackgroundChar({ id }) {
    const [style, setStyle] = useState(randomBackground());
    const [char, setChar] = useState(randomEntity());
    const elemId = 'backgroundchar' + id;

    useEffect(() => {
        handleAnimationEnd();
        // Ignore useEffect missing dependency handleAnimationEnd warning
        // eslint-disable-next-line
    }, []);

    function handleAnimationEnd() {
        // Stop current animation
        const elem = document.getElementById(elemId);
        elem.style.animationName = null; // stop animation

        // Setup new animation characteristics
        const newStyle = randomBackground();
        const newChar = randomEntity(); 
        const timeout = Math.floor(Math.random() * 20000 + 5000);
        const animation = randomAnimation();
        setChar(newChar);
        setStyle(newStyle);
        elem.style.animationDuration = `${timeout}ms`;

        // Trigger animation reflow
        void elem.offsetWidth;
        elem.style.animationName = animation;
    }

    return (
        <div className="backgroundChar" style={style} id={elemId} key={elemId} onAnimationEnd={handleAnimationEnd}>
            {char}
        </div>

    );
} 