import axios from 'axios';

export const fetchVideo = (videoID) => {
  return axios.get('/wp-json/utubevideogallery/v1/videos/' + videoID, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

export const updateVideo = (videoID, videoData) => {
  return axios.patch('/wp-json/utubevideogallery/v1/videos/' + videoID, {
    title: videoData.title,
    description: videoData.description,
    quality: videoData.quality,
    showControls: videoData.showControls,
    startTime: videoData.startTime,
    endTime: videoData.endTime,
    albumID: videoData.album
  }, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

export const getVideoPreview = (source, sourceID, startTime, endTime) => {
  if (source == 'youtube')
    return `https://www.youtube.com/embed/${sourceID}` +
      `?modestbranding=1&rel=0&showinfo=0&autohide=0&iv_load_policy=3` +
      `&color=white&theme=dark&autoplay=0&start=${startTime}&end=${endTime}`;
  else if (source == 'vimeo')
    return `https://player.vimeo.com/video/${sourceID}` +
      `?title=0&portrait=0&byline=0&badge=0&autoplay=0#t=${startTime}`;
}

export const fetchGalleryAlbums = (galleryID) => {
  return axios.get('/wp-json/utubevideogallery/v1/galleries/' + galleryID + '/albums', {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

export const parseAlbumsData = (albumsData) => {
  return albumsData.map(album => {
    return {name: album.title, value: album.id};
  });
}

export const getFormattedSource = (source) => {
  if (source == 'youtube')
    return 'YouTube';
  else if (source == 'vimeo')
    return 'Vimeo';
  else
    return;
}

export default {
  fetchVideo,
  updateVideo,
  getVideoPreview,
  fetchGalleryAlbums,
  parseAlbumsData,
  getFormattedSource
}
