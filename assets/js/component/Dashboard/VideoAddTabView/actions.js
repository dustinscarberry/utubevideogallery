import axios from 'axios';

export function createVideo(state, albumID)
{
  return axios.post(
    '/wp-json/utubevideogallery/v1/videos/',
    {
      sourceID: state.sourceID,
      title: state.title,
      description: state.description,
      quality: state.quality,
      showControls: state.showControls,
      startTime: state.startTime,
      endTime: state.endTime,
      source: state.source,
      albumID: albumID
    },
    { headers: {'X-WP-Nonce': utvJSData.restNonce} }
  );
}

export function parseURL(rawURL)
{
  //normalize url
  rawURL = rawURL.trim();
  rawURL = rawURL.toLowerCase();

  //get url parts
  if (rawURL)
  {
    if (
      rawURL.indexOf('youtube') !== -1
      || rawURL.indexOf('youtu.be') !== -1
    )
    {
      let matches = rawURL.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);

      if (matches)
        return {source: 'youtube', sourceID: matches[1]};
    }
    else if (rawURL.indexOf('vimeo') !== -1)
    {
      let matches = rawURL.match(/https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/);

      if (matches)
        return {source: 'vimeo', sourceID: matches[2]};
    }
  }

  return undefined;
}

export function getVideoPreview(source, sourceID, startTime, endTime)
{
  let src = '';

  if (source == 'youtube')
  {
    src = 'https://www.youtube.com/embed/';
    src += sourceID;
    src += '?modestbranding=1';
    src += '&rel=0';
    src += '&showinfo=0';
    src += '&autohide=0';
    src += '&iv_load_policy=3';
    src += '&color=white';
    src += '&theme=dark';
    src += '&autoplay=0';
    src += '&start=' + startTime;
    src += '&end=' + endTime;
  }
  else if (source == 'vimeo')
  {
    src = 'https://player.vimeo.com/video/';
    src += sourceID;
    src += '?title=0';
    src += '&portrait=0';
    src += '&byline=0';
    src += '&badge=0';
    src += '&autoplay=0';
    src += '#t=' + startTime;
  }

  return src;
}

export default {createVideo, parseURL, getVideoPreview}
