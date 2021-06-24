export const getYouTubeEmbedURL = (
  sourceID,
  hideDetails,
  showControls,
  playerTheme,
  playerColor,
  autoplay,
  startTime,
  endTime
) => {
  let source = 'https://www.youtube.com/embed/';
  source += sourceID;
  source += '?modestbranding=1';
  source += '&rel=0';
  source += '&showinfo=' + (hideDetails == '1' ? '0' : '1');
  source += '&autohide=1';
  source += '&controls=' + (showControls ? '1' : '0');
  source += '&theme=' + playerTheme;
  source += '&color=' + playerColor;
  source += '&autoplay=' + autoplay;
  source += '&iv_load_policy=3';
  source += '&start=' + startTime;
  source += '&end=' + endTime;
  return source;
}

export default { getYouTubeEmbedURL }
