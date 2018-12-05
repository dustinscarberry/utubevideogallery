import React from 'react';

const VimeoVideo = (props) =>
{
  const {
    videoData,
    forceNoAutoplay
  } = props;

  let source = 'https://player.vimeo.com/video/';
  source += videoData.slugID;
  source += '?autoplay=' + (forceNoAutoplay ? '0' : utvJSData.vimeoAutoplay);
  source += '&autopause=0';
  source += (utvJSData.vimeoDetailsHide == '1' ? 'title=0&portrait=0&byline=0&badge=0' : 'title=1&portrait=1&byline=1&badge=1');
  source += '#t=' + videoData.startTime;

  return (
    <iframe
      className="utv-video-panel-iframe"
      src={source}
      frameBorder="0"
      allowFullScreen="">
    </iframe>
  );
}

export default VimeoVideo;
