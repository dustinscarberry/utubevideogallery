import axios from 'axios';

//create playlist
export function createPlaylist(state)
{
  return axios.post(
    '/wp-json/utubevideogallery/v1/playlists',
    {
      title: state.playlistTitle,
      source: state.source,
      sourceID: state.sourceID,
      videoQuality: state.videoQuality,
      showControls: state.showControls,
      albumID: state.album
    },
    { headers: {'X-WP-Nonce': utvJSData.restNonce} }
  );
}

//create video
export function createVideo(sourceID, title, playlistID, state)
{
  return axios.post(
    '/wp-json/utubevideogallery/v1/videos',
    {
      sourceID: sourceID,
      title: title,
      quality: state.videoQuality,
      showControls: state.showControls,
      source: state.source,
      albumID: state.album,
      playlistID: playlistID
    },
    {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    }
  );
}

//fetch albums
export function fetchAlbums()
{
  return axios.get(
    '/wp-json/utubevideogallery/v1/albums',
    { headers: {'X-WP-Nonce': utvJSData.restNonce} }
  );
}

//parse albums data
export function parseAlbumsData(data = [])
{
  return data.map(album =>
  {
    return {
      name: album.title,
      value: album.id
    };
  });
}

//fetch remote playlist
export async function fetchRemotePlaylist(source, sourceID)
{
  if (source == 'youtube')
    return axios.get(
      '/wp-json/utubevideogallery/v1/youtubeplaylists/' + sourceID,
      { headers: {'X-WP-Nonce': utvJSData.restNonce} }
    );
  else if (this.state.source == 'vimeo')
    return axios.get(
      '/wp-json/utubevideogallery/v1/vimeoplaylists/' + sourceID,
      { headers: {'X-WP-Nonce': utvJSData.restNonce} }
    );
  else
    return undefined;
}

//parse remote playlist data
export function parseRemotePlaylistData(data)
{
  data.videos = data.videos.map((remoteVideo) => {
    remoteVideo.selected = true;
    return remoteVideo;
  });

  return data;
}

//parse playlist url parts [source, sourceID]
export function parsePlaylistURL(url)
{
  const matches = url.match(/^.*?(youtube|vimeo).*?(?:list=|album\/)(.*?)(?:&|$)/);

  if (matches && matches.length == 3)
    return {source: matches[1], sourceID: matches[2]};
  else
    return undefined;
}

//user feedback for video created
export function getVideoCreateMessage(videoTitle)
{
  return utvJSData.localization.feedbackVideoPartial
    + ' [' + videoTitle + '] '
    + utvJSData.localization.feedbackAddedPartial;
}

//is remote playlist loading
export function isPlaylistLoading(state)
{
  return (state.playlistLoading && state.url && state.url != '');
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
