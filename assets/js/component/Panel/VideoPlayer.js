import React from 'react';
import YouTubeVideo from './YouTubeVideo';
import VimeoVideo from './VimeoVideo';

const VideoPlayer = ({videoData, controls, forceNoAutoplay}) => {
  let videoNode;
  if (videoData.source == 'youtube')
    videoNode = <YouTubeVideo
      videoData={videoData}
      controls={controls}
      forceNoAutoplay={forceNoAutoplay}
    />;
  else if (videoData.source == 'vimeo')
    videoNode = <VimeoVideo
      videoData={videoData}
      forceNoAutoplay={forceNoAutoplay}
    />;

  return <div className="utv-panel-player">{videoNode}</div>
}

export default VideoPlayer;
