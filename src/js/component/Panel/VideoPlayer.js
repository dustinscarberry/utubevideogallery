import React from 'react';

const VideoPlayer = ({videoData}) =>
{
  //check out .chrome false true
  return (
    <div className="utv-video-panel-wrapper">
      <iframe
        className="utv-video-panel-iframe"
        src={'https://www.youtube.com/embed/' + videoData.slugID + '?modestbranding=1&rel=0&showinfo=0&autohide=1&controls=0&theme=dark&color=red&autoplay=0&iv_load_policy=3&start=' + videoData.startTime + '&end=' + videoData.endTime}
        frameBorder="0"
        allowFullScreen="">
      </iframe>
    </div>
  );
}

export default VideoPlayer;
