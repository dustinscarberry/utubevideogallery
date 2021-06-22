import axios from 'axios';

export const createGallery = (galleryData) => {
  return axios.post('/wp-json/utubevideogallery/v1/galleries/', {
    title: galleryData.title,
    albumSorting: galleryData.albumSorting,
    thumbnailType: galleryData.thumbnailType,
    displayType: galleryData.displayType
  }, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

export default { createGallery }
