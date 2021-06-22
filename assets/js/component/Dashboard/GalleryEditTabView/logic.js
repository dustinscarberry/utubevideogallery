import axios from 'axios';

export const fetchGallery = (galleryID) => {
  return axios.get('/wp-json/utubevideogallery/v1/galleries/' + galleryID, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

export const updateGallery = (galleryID, galleryData) => {
  return axios.patch('/wp-json/utubevideogallery/v1/galleries/' + galleryID, {
    title: galleryData.title,
    albumSorting: galleryData.albumSorting,
    thumbnailType: galleryData.thumbnailType,
    displayType: galleryData.displayType
  }, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

export const fetchGalleryVideos = (galleryID) => {
  return axios.get('/wp-json/utubevideogallery/v1/galleries/' + galleryID + '/videos', {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

export const updateVideoThumbnail = (videoID) => {
  return axios.patch('/wp-json/utubevideogallery/v1/videos/' + videoID, {}, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

export const getThumbnailUpdateMessage = (videoTitle) => {
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
