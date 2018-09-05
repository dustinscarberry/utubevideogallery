import React from 'react';
import Thumbnails from '../shared/Thumbnails';
import VideoThumbnail from './VideoThumbnail';

const VideoThumbnails = ({videos, onOpenVideo}) =>
{
  let videoThumbnails = videos.map((e, i) =>
  {
    return (<VideoThumbnail
      key={i}
      title={e.title}
      image={e.thumbnail}
      value={i}
      onOpenVideo={onOpenVideo}
    />);
  });

  return (
    <Thumbnails className="utv-video-panel-thumbnails utv-align-center">
      {videoThumbnails}
    </Thumbnails>
  );
}

export default VideoThumbnails;
