import React from 'react';
import YouTubeVideo from './YouTubeVideo';
import VimeoVideo from './VimeoVideo';

const VideoPlayer = ({videoData, controls}) =>
{
  let video = undefined;

  if (videoData.source == 'youtube')
    video = <YouTubeVideo
      videoData={videoData}
      controls={controls}
    />;
  else if (videoData.source == 'vimeo')
    video = <VimeoVideo videoData={videoData}/>;

  return (
    <div className="utv-video-panel-wrapper">
      {video}
    </div>
  );
}

export default VideoPlayer;
