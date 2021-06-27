import axios from 'axios';

export const fetchSettings = () => {
  return axios.get('/wp-json/utubevideogallery/v1/settings', {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

export const updateSettings = (settings) => {
  return axios.patch('/wp-json/utubevideogallery/v1/settings', {
    playerControlsColor: settings.playerControlsColor,
    popupPlayerWidth: settings.popupPlayerWidth,
    popupPlayerOverlayColor: settings.popupPlayerOverlayColor,
    popupPlayerOverlsayOpacity: settings.popupPlayerOverlayOpacity,
    removeVideoPopupScript: settings.removeVideoPopupScript,
    thumbnailBorderRadius: settings.thumbnailBorderRadius,
    thumbnailWidth: settings.thumbnailWidth,
    thumbnailHorizontalPadding: settings.thumbnailHorizontalPadding,
    thumbnailVerticalPadding: settings.thumbnailVerticalPadding,
    showVideoDescription: settings.showVideoDescription,
    vimeoAutoplay: settings.vimeoAutoplay,
    vimeoHideDetails: settings.vimeoHideDetails,
    youtubeAPIKey: settings.youtubeAPIKey,
    youtubeAutoplay: settings.youtubeAutoplay,
    youtubeHideDetails: settings.youtubeHideDetails
  }, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

export const fetchAllVideos = () => {
  return axios.get('/wp-json/utubevideogallery/v1/videos', {
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
  fetchSettings,
  updateSettings,
  fetchAllVideos,
  updateVideoThumbnail,
  getThumbnailUpdateMessage
}
