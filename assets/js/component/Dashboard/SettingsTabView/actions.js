import axios from 'axios';

export function fetchSettings()
{
  return axios.get(
    '/wp-json/utubevideogallery/v1/settings',
    {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    }
  );
}

export function updateSettings(state)
{
  return axios.patch(
    '/wp-json/utubevideogallery/v1/settings',
    {
      playerControlsColor: state.playerControlsColor,
      playerControlsTheme: state.playerControlsTheme,
      popupPlayerWidth: state.popupPlayerWidth,
      popupPlayerOverlayColor: state.popupPlayerOverlayColor,
      popupPlayerOverlayOpacity: state.popupPlayerOverlayOpacity,
      removeVideoPopupScript: state.removeVideoPopupScript,
      thumbnailBorderRadius: state.thumbnailBorderRadius,
      thumbnailWidth: state.thumbnailWidth,
      thumbnailHorizontalPadding: state.thumbnailHorizontalPadding,
      thumbnailVerticalPadding: state.thumbnailVerticalPadding,
      showVideoDescription: state.showVideoDescription,
      vimeoAutoplay: state.vimeoAutoplay,
      vimeoHideDetails: state.vimeoHideDetails,
      youtubeAPIKey: state.youtubeAPIKey,
      youtubeAutoplay: state.youtubeAutoplay,
      youtubeHideDetails: state.youtubeHideDetails
    },
    {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    }
  );
}

export function fetchAllVideos()
{
  return axios.get(
    '/wp-json/utubevideogallery/v1/videos',
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
  fetchSettings,
  updateSettings,
  fetchAllVideos,
  updateVideoThumbnail,
  getThumbnailUpdateMessage
}
