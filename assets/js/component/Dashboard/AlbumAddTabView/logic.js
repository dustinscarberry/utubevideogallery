import axios from 'axios';

export const createAlbum = (albumData) => {
  return axios.post('/wp-json/utubevideogallery/v1/albums/',
    albumData,
    {headers: {'X-WP-Nonce': utvJSData.restNonce}}
  );
}

export default { createAlbum };
