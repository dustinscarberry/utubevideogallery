import axios from 'axios';

export const createVideo = (video, albumID) => {
  return axios.post('/wp-json/utubevideogallery/v1/videos/', {
    sourceID: video.sourceID,
    title: video.title,
    description: video.description,
    showControls: video.showControls,
    startTime: video.startTime,
    endTime: video.endTime,
    source: video.source,
    albumID: albumID
  }, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

export const parseURL = (unparsedUrl) => {
  // normalize url
  unparsedUrl = unparsedUrl.trim();

  if (!unparsedUrl) return;

  // get url parts
  if (
    unparsedUrl.indexOf('youtube') !== -1
    || unparsedUrl.indexOf('youtu.be') !== -1
  ) {
    const matches = unparsedUrl.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);

    if (matches) return {source: 'youtube', sourceID: matches[1]};
  } else if (unparsedUrl.indexOf('vimeo') !== -1) {
    const matches = unparsedUrl.match(/https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/);

    if (matches) return {source: 'vimeo', sourceID: matches[2]};
  }

  return;
}

export const getVideoPreview = (source, sourceID, startTime, endTime) => {
  if (source == 'youtube')
    return `https://www.youtube.com/embed/${sourceID}` +
      `?modestbranding=1&rel=0&showinfo=0&autohide=0&iv_load_policy=3` +
      `&color=white&autoplay=0&start=${startTime}&end=${endTime}`;
  else if (source == 'vimeo')
    return `https://player.vimeo.com/video/${sourceID}` +
      `?title=0&portrait=0&byline=0&badge=0&autoplay=0#t=${startTime}`;
}

export default {
  createVideo,
  parseURL,
  getVideoPreview
}
