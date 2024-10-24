/**
 * Modal dialog React component.  
 * 
 * by Fred de Laszlo 
 * 15-OCT-2024 
 */
import React from 'react';
import './Modal.css';

/**
 * React compenent that creates HTML to simulate a modal dialog.
 * 
 * @param {Object} - showModal {Boolean), title (String), message (String), handleOnModalOK (callback function)
 * @returns HTML dialog
 */
function Modal({ showModal, title, message, handleOnModalOK }) {

    // If being shown, add an event listener to detect key presses
    // for enter, escape and space keys.
    const handleOnKeyDown = (e) => {
        if (e.code === 'Enter' || e.code === 'Escape' || e.code === 'Space') {
            handleOnModalOK();
        }
    };

    // No need for useEffect hook - the event listener is not reliant on                                            
    // on-screen rendering. 
    if (showModal === false) {
        window.removeEventListener("keydown", handleOnKeyDown);
        return false;
    }                                       

    window.addEventListener("keydown", handleOnKeyDown);

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