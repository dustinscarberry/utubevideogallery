import axios from 'axios';

export const deletePlaylist = (playlistID) => {
  return axios.delete('/wp-json/utubevideogallery/v1/playlists/' + playlistID, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}
