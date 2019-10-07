import axios from 'axios';

export function createGallery(state)
{
  return axios.post(
    '/wp-json/utubevideogallery/v1/galleries/',
    {
      title: state.title,
      albumSorting: state.albumSorting,
      thumbnailType: state.thumbnailType,
      displayType: state.displayType
    },
    {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    }
  );
}

export default {createGallery}
