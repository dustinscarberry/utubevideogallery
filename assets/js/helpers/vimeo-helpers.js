export const getVimeoEmbedURL = (
  sourceID,
  autoplay,
  hideDetails,
  startTime
) => {
  let source = 'https://player.vimeo.com/video/';
  source += sourceID;
  source += '?autoplay=' + autoplay;
  source += '&autopause=0';
  source += (hideDetails == '1' ? 'title=0&portrait=0&byline=0&badge=0' : 'title=1&portrait=1&byline=1&badge=1');
  source += '#t=' + startTime;
  return source;
}

export default {
  getVimeoEmbedURL
};
