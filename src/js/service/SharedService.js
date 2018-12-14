class SharedService
{
  getYouTubeEmbedURL(
    sourceID,
    hideDetails,
    showControls,
    playerTheme,
    playerColor,
    autoplay,
    startTime,
    endTime
  )
  {
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

  getVimeoEmbedURL(
    sourceID,
    autoplay,
    hideDetails,
    startTime
  )
  {
    let source = 'https://player.vimeo.com/video/';
    source += sourceID;
    source += '?autoplay=' + autoplay;
    source += '&autopause=0';
    source += (hideDetails == '1' ? 'title=0&portrait=0&byline=0&badge=0' : 'title=1&portrait=1&byline=1&badge=1');
    source += '#t=' + startTime;
    return source;
  }
}

export default new SharedService();
