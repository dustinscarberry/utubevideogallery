import axios from 'axios';

export function fetchGallery(galleryID)
{
  return axios.get(
    '/wp-json/utubevideogallery/v1/galleries/' + galleryID,
    {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    }
  );
}

export function updateGallery(galleryID, state)
{
  return axios.patch(
    '/wp-json/utubevideogallery/v1/galleries/' + galleryID,
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

export function fetchGalleryVideos(galleryID)
{
  return axios.get(
    '/wp-json/utubevideogallery/v1/galleries/' + galleryID + '/videos',
    {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    }
  );
}

export function updateVideoThumbnail(videoID)
{
  return axios.patch(
    '/wp-json/utubevideogallery/v1/videos/' + videoID,
    {},
    {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    }
  );
}

export function getThumbnailUpdateMessage(videoTitle)
{
  return utvJSData.localization.feedbackVideoPartial
  + ' [' + videoTitle + '] '
  + utvJSData.localization.feedbackUpdatedPartial;
}

export default {
  fetchGallery,
  updateGallery,
  fetchGalleryVideos,
  updateVideoThumbnail,
  getThumbnailUpdateMessage
}
