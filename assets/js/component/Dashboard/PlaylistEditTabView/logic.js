import axios from 'axios';

// fetch local playlist
export const fetchPlaylist = (playlistID) => {
  return axios.get('/wp-json/utubevideogallery/v1/playlists/' + playlistID, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

// fetch remote playlist
export const fetchRemotePlaylist = async (source, sourceID) => {
  if (source == 'youtube')
    return axios.get('/wp-json/utubevideogallery/v1/youtubeplaylists/' + sourceID, {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    });
  else if (source == 'vimeo')
    return axios.get('/wp-json/utubevideogallery/v1/vimeoplaylists/' + sourceID, {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    });

  return;
}

//// TODO: create dedicated endpoint to get videos from playlist id instead of entire album
// fetch local playlist videos
export const fetchLocalPlaylistVideos = (albumID) => {
  return axios.get('/wp-json/utubevideogallery/v1/albums/' + albumID + '/videos', {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

// combine local and remote playlist videos
export const combineVideos = (localData, remoteData) => {
  let combinedVideos = {};

  // add local videos
  for (const video of localData) {
    combinedVideos[video.sourceID] = {};
    combinedVideos[video.sourceID].title = video.title;
    combinedVideos[video.sourceID].description = video.description;
    combinedVideos[video.sourceID].thumbnail = utvJSData.thumbnailCacheDirectory + video.thumbnail + '.jpg';
    combinedVideos[video.sourceID].sourceID = video.sourceID;
    combinedVideos[video.sourceID].localID = video.id;
    combinedVideos[video.sourceID].selected = true;
    combinedVideos[video.sourceID].legend = 'local';
  }

  // add remote videos
  for (const video of remoteData.videos) {
    if (video.sourceID in combinedVideos) {
      combinedVideos[video.sourceID].title = video.title;
      combinedVideos[video.sourceID].description = video.description;
      combinedVideos[video.sourceID].thumbnail = video.thumbnail;
      combinedVideos[video.sourceID].legend = 'both';
    } else {
      combinedVideos[video.sourceID] = {};
      combinedVideos[video.sourceID].title = video.title;
      combinedVideos[video.sourceID].description = video.description;
      combinedVideos[video.sourceID].thumbnail = video.thumbnail;
      combinedVideos[video.sourceID].sourceID = video.sourceID;
      combinedVideos[video.sourceID].localID = undefined;
      combinedVideos[video.sourceID].selected = false;
      combinedVideos[video.sourceID].legend = 'web';
    }
  }

  // convert object to array
  combinedVideos = Object.keys(combinedVideos).map(key => combinedVideos[key]);
  return combinedVideos;
}

// get formatted source name
export const getFormattedSource = (source) => {
  if (source == 'youtube')
    return 'YouTube';
  else if (source == 'vimeo')
    return 'Vimeo';

  return;
}

// update playlist
export const updatePlaylist = (playlistID, playlistData) => {
  return axios.patch('/wp-json/utubevideogallery/v1/playlists/' + playlistID, {
    videoQuality: playlistData.videoQuality,
    showControls: playlistData.showControls
  }, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

// create / update / delete video based on sync method and selection
export const syncVideo = (syncMethod, playlistID, video, state) => {
  if (syncMethod == 'syncSelected') {
    // update video
    if (video.selected && video.localID)
      updateVideo(video, state);
    // create video
    else if (video.selected && !video.localID)
      createVideo(playlistID, video, state);
    // delete video
    else if (!video.selected && video.localID)
      deleteVideo(video);
  } else if (syncMethod == 'syncNew') {
    // create video
    if (!video.localID)
      createVideo(playlistID, video, state);
  } else if (syncMethod == 'syncAll') {
    // update video
    if (video.localID)
      updateVideo(video, state);
    // create video
    else
      createVideo(playlistID, video, state);
  }
}

// create playlist video
export const createVideo = (playlistID, video, state) => {
  return axios.post('/wp-json/utubevideogallery/v1/videos', {
    sourceID: video.sourceID,
    title: video.title,
    description: video.description,
    quality: state.videoQuality,
    showControls: state.showControls,
    source: state.source,
    albumID: state.albumID,
    playlistID: playlistID
  }, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

// update playlist video
export const updateVideo = (video, state) => {
  return axios.patch('/wp-json/utubevideogallery/v1/videos/' + video.localID, {
    title: video.title,
    description: video.description,
    quality: state.videoQuality,
    controls: state.showControls
  }, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

// delete playlist video
export const deleteVideo = (video) => {
  return axios.delete('/wp-json/utubevideogallery/v1/videos/' + video.localID, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

// user feedback for video updated / created / deleted
export const getVideoUpdateMessage = (videoTitle) => {
  return utvJSData.localization.feedbackVideoPartial
    + ' [' + videoTitle + '] '
    + utvJSData.localization.feedbackUpdatedPartial;
}

export default {
  fetchPlaylist,
  fetchRemotePlaylist,
  fetchLocalPlaylistVideos,
  combineVideos,
  getFormattedSource,
  updatePlaylist,
  syncVideo,
  createVideo,
  updateVideo,
  deleteVideo,
  getVideoUpdateMessage
}
