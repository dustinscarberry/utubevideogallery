import React from 'react';
import YouTubeVideo from './YouTubeVideo';
import VimeoVideo from './VimeoVideo';

const VideoPlayer = ({videoData, controls, forceNoAutoplay}) =>
{
  let video = undefined;

  if (videoData.source == 'youtube')
    video = <YouTubeVideo
      videoData={videoData}
      controls={controls}
      forceNoAutoplay={forceNoAutoplay}
    />;
  else if (videoData.source == 'vimeo')
    video = <VimeoVideo
      videoData={videoData}
      forceNoAutoplay={forceNoAutoplay}
    />;

  return (
    <div className="utv-video-panel-player">
      {video}
    </div>
  );
}

export default VideoPlayer;
