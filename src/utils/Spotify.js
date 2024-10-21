/**
 * Spotify API using preferred authorisation with PKCE
 * Modified from https://github.com/spotify/web-api-examples/tree/master/authorization/authorization_code_pkce
 *
 * Allows search of track/album/artist and saving of a playlist
 * 
 * by Fred de Laszlo 
 * 15-OCT-2024 
*/
import top20 from './top20';  // For demo if no client ID

//////////////////////// REPLACE WITH YOUR APP DETAILS //////////////////////////


const clientId = ''; // your clientId
const redirectUrl = 'http://localhost:3000/';        // your redirect URL - must be localhost URL and/or HTTPS


/////////////////////////////////////////////////////////////////////////////////

// An exported boolean indicating if in demo mode or not.
export const isDemo = clientId.length > 0 ? false : true;

//Redirect to HTTPS if necessary if not localhost (and not in demo mode)
if (!isDemo) {
    if (window.location.host.indexOf('localhost') < 0
        && window.location.protocol.toLowerCase() !== 'https:') {
        let url = '' + window.location;
        url = url.replace('http:', 'https:');
        window.location.replace(url);
    }
}

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = 'playlist-modify-public';
const limit = 20; // Number of tracks to return from search

// Data structure that manages the current active token, caching it in browser storage
const currentToken = {
    get access_token() { return localStorage.getItem('access_token') || null; },
    get refresh_token() { return localStorage.getItem('refresh_token') || null; },
    get expires_in() { return localStorage.getItem('refresh_in') || null },
    get expires() { return localStorage.getItem('expires') || null },

    /**
     * Stores access token details in browser storage
     * @param {Object} response - The object returned from spotify 
     */
    save: function (response) {
        const { access_token, refresh_token, expires_in } = response;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('expires_in', expires_in);

        const now = new Date();
        const expiry = new Date(now.getTime() + (expires_in * 1000));
        localStorage.setItem('expires', expiry);
    },

    /**
     * Clear browser storage and refresh the page
     * to restart the app.
     */
    reset: function () {
        localStorage.clear();
        window.location.refresh();
    }
};

// Attempts to get access token from spotify using PKCE authentication
// If client id is empty, authentication does not occur.
async function authenticate() {
    if (!isDemo) {
        // On page load, try to fetch auth code from current browser search URL
        const args = new URLSearchParams(window.location.search);
        const code = args.get('code');

        // If we find a code, we're in a callback, do a token exchange
        if (code) {
            const token = await getToken(code);
            currentToken.save(token);

            // Remove code from URL so we can refresh correctly.
            const url = new URL(window.location.href);
            url.searchParams.delete("code");

            const updatedUrl = url.search ? url.href : url.href.replace('?', '');
            window.history.replaceState({}, document.title, updatedUrl);
        }

        // Get a token if we don't already have one.
        if (!currentToken.access_token) {
            await redirectToSpotifyAuthorize();
        }
    }
}

authenticate();


/**
 * Start of PKCE authentication. Creates a code that is used to login a user.
 */
async function redirectToSpotifyAuthorize() {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = crypto.getRandomValues(new Uint8Array(64));
    const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");

    const code_verifier = randomString;
    const data = new TextEncoder().encode(code_verifier);
    const hashed = await crypto.subtle.digest('SHA-256', data);

    const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    window.localStorage.setItem('code_verifier', code_verifier);

    const authUrl = new URL(authorizationEndpoint)
    const params = {
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        code_challenge_method: 'S256',
        code_challenge: code_challenge_base64,
        redirect_uri: redirectUrl,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
}

/**
 * Get a new access token based on code recieved after login authentication
 * @param {Object} code - recieved from Spotify login authentication
 *  
 * @returns {Object} JSON response containing access details.
 */
async function getToken(code) {
    const code_verifier = localStorage.getItem('code_verifier');

    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUrl,
            code_verifier: code_verifier,
        }),
    });
    return await response.json();
}

/**
 * Fetch a new access token using current refresh token.
 * @returns {Object} JSON response containing refreshed access details.
 */
async function refreshToken() {
    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'refresh_token',
            refresh_token: currentToken.refresh_token
        }),
    });

    return await response.json();
}

/**
 * Exported class like object with functions to search for tracks and 
 * save playlists 
 */
export const Spotify = {
    numPerPage: 20,
    currentPage: 1,
    totalPages: 1,

    /**
     * Search for tracks
     * @param {String} term - search for tracks/albums/artists containing term. 
     * @returns {Array} Array of objects of tracks found.
     */
    async search(term, page) {
        if (isDemo) {
            // If in demo mode, used pre-created list of tracks (top20)...
            const x = top20.filter(({ title, artist }) =>
                title.toUpperCase().search(term.toUpperCase()) >= 0 ||
                artist.toUpperCase().search(term.toUpperCase()) >= 0
            );
            return x;
        } else {
            // ... else try to fetch results from spotify
            const accessToken = currentToken.access_token;
            const offset = this.numPerPage * (page - 1);
            try {
                return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}&limit=${limit}&offset=${offset}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => {
                    return response.json();
                }).then(jsonResponse => {
                    // Check for 401 error (access token expired) and refresh as necessary
                    if (jsonResponse.error && jsonResponse.error.status === 401 && jsonResponse.error.message === "The access token expired") {
                        // Get a new access token
                        return refreshToken().then(response => {
                            if (response.access_token) {
                                currentToken.save(response);
                                return this.search(term, page);
                            } else {
                                currentToken.reset();
                            }
                        });
                    }
                    if (!jsonResponse.tracks) {
                        return [];
                    }
                    this.totalPages = jsonResponse.tracks.total;
                    this.currentPage = jsonResponse.tracks.offset / jsonResponse.tracks.limit + 1;
                    return jsonResponse.tracks.items.map(track => ({
                        id: track.id,
                        title: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    }));
                });
            } catch (error) {
                // Something went wrong, delete local storage and refresh page
                currentToken.reset();
            }
        }
    },

    /**
     * Save a new playlist to users' Spotify account. 
     * @param {String} name - the name of the playlist
     * @param {Array} trackUris - an array with hthe playlist tracks to save.
     * @returns void
     */
    async savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }

        const accessToken = currentToken.access_token;
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;

        try {
            return fetch('https://api.spotify.com/v1/me', { headers: headers }
            ).then(response => response.json()
            ).then(jsonResponse => {
                // Check for expired access token.
                if (jsonResponse.error && jsonResponse.error.status === 401) {
                    return refreshToken().then(response => {
                        if (response.access_token) {
                            currentToken.save(response);
                            return this.savePlaylist(name, trackUris);
                        } else {
                            currentToken.reset();
                        }
                    });
                }
                userId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ name: name })
                }).then(response => response.json()
                ).then(jsonResponse => {
                    const playlistId = jsonResponse.id;
                    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                        headers: headers,
                        method: 'POST',
                        body: JSON.stringify({ uris: trackUris })
                    });
                });
            });
        } catch (error) {
            // Something went wrong, delete local storage and refresh page
            currentToken.reset();
        }
    },
}




