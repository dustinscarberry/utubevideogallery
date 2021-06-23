import axios from 'axios';

export const createAlbum = (galleryID, albumData) => {
  return axios.post('/wp-json/utubevideogallery/v1/albums/', {
    title: albumData.title,
    videoSorting: albumData.videoSorting,
    galleryID: galleryID
  }, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

export default { createAlbum };
