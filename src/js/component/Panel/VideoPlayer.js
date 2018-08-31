import React from 'react';
import YouTubeVideo from './YouTubeVideo';
import VimeoVideo from './VimeoVideo';

const VideoPlayer = ({videoData, controls, isFirstRender}) =>
{
  let video = undefined;

  if (videoData.source == 'youtube')
    video = <YouTubeVideo
      videoData={videoData}
      controls={controls}
      forceNoAutoplay={isFirstRender}
    />;
  else if (videoData.source == 'vimeo')
    video = <VimeoVideo
      videoData={videoData}
      forceNoAutoplay={isFirstRender}
    />;

  return (
    <div className="utv-video-panel-wrapper">
      {video}
    </div>
  );
}

export default VideoPlayer;
