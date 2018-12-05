import React from 'react';
import Thumbnails from '../shared/Thumbnails';
import VideoThumbnail from './VideoThumbnail';

const VideoThumbnails = (props) =>
{
  const {
    videos,
    onOpenVideo,
    thumbnailType
  } = props;

  const thumbnailsClasses = ['utv-video-gallery-thumbnails', 'utv-align-center'];

  if (thumbnailType == 'square')
    thumbnailsClasses.push('utv-thumbnails-square');
  else
    thumbnailsClasses.push('utv-thumbnails-rectangle');

  const videoThumbnails = videos.map((video, i) =>
  {
    return (<VideoThumbnail
      key={i}
      title={video.title}
      image={video.thumbnail}
      value={i}
      onOpenVideo={onOpenVideo}
    />);
  });

  return (
    <Thumbnails className={thumbnailsClasses.join(' ')}>
      {videoThumbnails}
    </Thumbnails>
  );
}

export default VideoThumbnails;
