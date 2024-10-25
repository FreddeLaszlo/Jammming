/**
 * Main 'App' React component.  
 * 
 * by Fred de Laszlo 
 * 15-OCT-2024 
 */
import React, { useEffect, useState } from 'react';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Tracklist from '../Tracklist/Tracklist';
import Background from '../Background/Background';
import { Spotify, isDemo } from '../../utils/Spotify';
import Modal from '../Modal/Modal';
import Demo from '../Demo/Demo';
import './App.css';

/**
 * Creates the HTML for the application
 * @returns App portion of HTML
 */
function App() {

  const [searchResults, setSearchResults] = useState([]);
  const [playList, setPlayList] = useState([]);
  const [message, setMessage] = useState(''); // For modal dialog
  const [inert, setInert] = useState(null); // For modal dialog
  const [title, setTitle] = useState(''); // For modal dialog
  const [showModal, setShowModal] = useState(false); // For modal dialog
  const [disablePlaylistButtons, setDisablePlaylistButtons] = useState(null); // Stop button clicks whilst saving
  const [find, setFind] = useState('');

  function modifySearchResults(tracks) {
    const newData = [];
    tracks.forEach(track => {
      track.inPlaylist = playList.filter((t) => t.id === track.id).length;
      newData.push(track);
    });
    return newData;
  }

  /**
   * Search button event handler
   * @param {String} data - the text to search for in tracks/albums/artists 
   */
  async function handleFind(data) {
    setFind(data);
    const results = await Spotify.search(data, 1);
    const modifiedResults = modifySearchResults(results);
    setSearchResults(modifiedResults);
  }

  async function onPageRequest(page) {
    const results = await Spotify.search(find, page);
    const modifiedResults = modifySearchResults(results);
    setSearchResults(modifiedResults);
  }


  useEffect(() => {
    const newSearchResult = [];
    searchResults.forEach(track => {
      track.inPlaylist = playList.filter((t) => t.id === track.id).length;
      newSearchResult.push(track);
    });
    setSearchResults(newSearchResult);
  }, [playList]);
  /**
   * Add track button handler.
   * Adds a track to playlist
   * @param {Object} track - details of the track 
   */
  function handleAddTrack(track) {
    setPlayList((prev) => [...prev, track]);
  }

  /**
   * Remove track from playlist handler.
   * @param {Number} index - index of track in playlist
   */
  function handleRemoveTrack(index) {
    // Disable warning for '!= found instead of !=='.
    // eslint-disable-next-line
    setPlayList((prev) => prev.filter((track, i) => index != i));
  }

  /**
   * Clear play list handler.
   * Removes all tracks from playlist
   */
  function onClearList() {
    setPlayList([]);
  }

  /**
 * Handles save playlist event.
 * Saves a new playlist to users' spotify account.
 * @param {String} playlistName - the name of the playlist
 */
  async function handleSaveList(playlistName) {
    if (playlistName.length === 0) {
      popupModal("Save Playlist", "Please enter a name for your playlist!")
      return;
    } else if (playList.length === 0) {
      popupModal("Save Playlist", 'You need to add one or more tracks to your playlist before saving it!');
      return;
    }
    if (!isDemo) {
      setDisablePlaylistButtons(true);
      try {
        const trackUris = playList.map((track) => track.uri);
        await Spotify.savePlaylist(playlistName, trackUris).then(() => {
          popupModal("Save Playlist", `Playlist '${playlistName}' saved.`);
        });

      } catch (error) {
        popupModal("Save Playlist", "There was a problem saving the playlist. Please try again");
      }
    } else {
      popupModal("Demo Save Playlist", `Demo playlist '${playlistName}' saved.`);
    }
    setDisablePlaylistButtons(null);
  }

  /**
   * Shows the modal dialog.
   * Sets 'inert' asttribute on App html div to:
   * 1. Stop tabbing to elements on page behind dialog
   * 2. Helps assistive technology find modal dialog.
   * @param {String} message - the text to display in dialog.
   */
  function popupModal(title, message) {
    if (message.length > 0) {
      setTitle(title);
      setMessage(message);
      setInert('true');
      setShowModal(true);
    }
  }

  /**
   * Handles OK button click on modal dialog.
   * Removes the dialog from screen.
   */
  function handleOnModalOK() {
    console.log("App.handleOnModalOK");
    setShowModal(false);
    setInert(null);
  }

  return (
    <>
      <h1>Jammming!</h1>
      <div className='App' inert={inert}>
        <SearchBar onFind={handleFind} />
        <div className='layout'>
          <SearchResults
            searchResults={searchResults}
            onAddTrack={handleAddTrack}
            page={Spotify.currentPage}
            numPages={Spotify.totalPages}
            onPageRequest={onPageRequest} />
          <div>
            <div className='playlist'>
              <Playlist onClearList={onClearList} onSaveList={handleSaveList} disableButtons={disablePlaylistButtons} />
              <Tracklist playList={playList} onRemoveTrack={handleRemoveTrack} />
            </div>
          </div>
        </div>
      </div>
      <Background numChars={50} />
      <Demo isDemo={isDemo} />
      <Modal showModal={showModal} title={title} message={message} handleOnModalOK={handleOnModalOK} />
    </>
  );
}

export default App;
