import React from 'react';

const YouTubeVideo = ({videoData, controls, forceNoAutoplay}) =>
{
  let source = 'https://www.youtube.com/embed/';
  source += videoData.slugID;
  source += '?modestbranding=1';
  source += '&rel=0';
  source += '&showinfo=' + (utvJSData.youtubeDetailsHide == '1' ? '0' : '1');
  source += '&autohide=1';
  source += '&controls=' + (controls == true ? '1' : '0');
  source += '&theme=' + utvJSData.playerControlTheme;
  source += '&color=' + utvJSData.playerProgressColor;
  source += '&autoplay=' + (forceNoAutoplay ? '0' : utvJSData.youtubeAutoplay);
  source += '&iv_load_policy=3';
  source += '&start=' + videoData.startTime;
  source += '&end=' + videoData.endTime;

  return (
    <iframe
      className="utv-video-panel-iframe"
      src={source}
      frameBorder="0"
      allowFullScreen="">
    </iframe>
  );
}

export default YouTubeVideo;
