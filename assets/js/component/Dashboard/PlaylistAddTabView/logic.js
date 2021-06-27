import axios from 'axios';

// create playlist
export const createPlaylist = (state) => {
  return axios.post('/wp-json/utubevideogallery/v1/playlists', {
    title: state.playlistTitle,
    source: state.source,
    sourceID: state.sourceID,
    videoQuality: state.videoQuality,
    showControls: state.showControls,
    albumID: state.album
  }, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

// create video
export const createVideo = (playlistID, video, playlist) => {
  return axios.post('/wp-json/utubevideogallery/v1/videos', {
    sourceID: video.sourceID,
    title: video.title,
    quality: playlist.videoQuality,
    showControls: playlist.showControls,
    source: playlist.source,
    albumID: playlist.album,
    playlistID: playlistID
  }, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

// fetch albums
export const fetchAlbums = () => {
  return axios.get('/wp-json/utubevideogallery/v1/albums', {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

// parse albums data
export const parseAlbumsData = (albumsData = []) => {
  return albumsData.map(album => {
    return {name: album.title, value: album.id};
  });
}

// fetch remote playlist
export const fetchRemotePlaylist = async (source, sourceID) =>  {
  if (source == 'youtube')
    return axios.get(
      '/wp-json/utubevideogallery/v1/youtubeplaylists/' + sourceID, {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    });
  else if (this.state.source == 'vimeo')
    return axios.get(
      '/wp-json/utubevideogallery/v1/vimeoplaylists/' + sourceID, {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    });

  return;
}

// parse remote playlist data
export const parseRemotePlaylistData = (playlistData) => {
  playlistData.videos = playlistData.videos.map((remoteVideo) => {
    remoteVideo.selected = true;
    return remoteVideo;
  });

  return playlistData;
}

// parse playlist url parts [source, sourceID]
export const parsePlaylistURL = (url) => {
  const matches = url.match(/^.*?(youtube|vimeo).*?(?:list=|album\/)(.*?)(?:&|$)/);

  if (matches && matches.length == 3)
    return {source: matches[1], sourceID: matches[2]};

  return;
}

// user feedback for video created
export const getVideoCreateMessage = (videoTitle) => {
  return utvJSData.localization.feedbackVideoPartial
    + ' [' + videoTitle + '] '
    + utvJSData.localization.feedbackAddedPartial;
}

// is remote playlist loading
export const isPlaylistLoading = (state) => {
  return (state.playlistLoading && state.playlist.url && state.playlist.url != '');
}

export default {
  createPlaylist,
  createVideo,
  fetchAlbums,
  parseAlbumsData,
  fetchRemotePlaylist,
  parseRemotePlaylistData,
  parsePlaylistURL,
  getVideoCreateMessage,
  isPlaylistLoading
}
