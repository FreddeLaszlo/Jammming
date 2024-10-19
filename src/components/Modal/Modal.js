/**
 * Modal dialog React component.  
 * 
 * by Fred de Laszlo 
 * 15-OCT-2024 
 */
import React, { useEffect } from 'react';
import './Modal.css';

/**
 * React compenent that creates HTML to simulate a modal dialog.
 * Set message to non zero length string to show, zewro length to remove.
 * @param {Object} - message (String), handleOnModalOK (callback function)
 * @returns HTML dialog
 */
function Modal({ title, message, handleOnModalOK }) {

    // When there is a message we add keyboard handler.
    // Return cleanup that removes the keyboard handler.
    useEffect(() => {
        if (message.length > 0) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    });

    /**
     * Handle return, space or esc key pressed
     * @param {Object} e - the event object
     */
    function handleKeyDown(e) {
        e.preventDefault();
        if (e.code === 'Enter' || e.code === 'Escape' || e.code === 'Space') {
            handleOnModalOK();
        }
    }

    if (message.length === 0) {
        // Return false to force unmount and run clean up code (useEffect).
        return false; 
    }

    return (
        <dialog
            className="modalBackground"

            aria-labelledby='modalTitle'
            aria-describedby='modalDescription'

        >
            <div className="modalMessage">
                <h4 id="modalTitle">{title}</h4>
                <p id="modalDescription">{message}</p>
                <div>
                    <button id="modalOkButton" onClick={handleOnModalOK} autoFocus>OK</button>
                </div>
            </div>
        </dialog>
    );
}

export default Modal;