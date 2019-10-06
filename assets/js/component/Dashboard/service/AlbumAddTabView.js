import axios from 'axios';

export async function createAlbum(title, videoSorting, galleryID)
{
  return await axios.post(
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
