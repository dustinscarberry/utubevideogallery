import React from 'react';
import Thumbnails from '../shared/Thumbnails';
import VideoThumbnail from './VideoThumbnail';
import galleryService from '../../service/GalleryService';

const VideoThumbnails = (props) =>
{
  const {
    videos,
    onOpenVideo,
    thumbnailType
  } = props;

  const thumbnailsClasses = galleryService.getThumbnailsClasses(thumbnailType);

  const videoThumbnailNodes = videos.map((video, i) =>
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
      {videoThumbnailNodes}
    </Thumbnails>
  );
}

export default VideoThumbnails;
