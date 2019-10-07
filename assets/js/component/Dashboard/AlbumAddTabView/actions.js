import axios from 'axios';

export function createAlbum(title, videoSorting, galleryID)
{
  return axios.post(
    '/wp-json/utubevideogallery/v1/albums/',
    {
      title: title,
      videoSorting: videoSorting,
      galleryID: galleryID
    },
    {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    }
  );
}

export default {createAlbum}
