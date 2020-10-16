import React from 'react';
import ThumbnailsGrid from '../shared/ThumbnailsGrid';
import VideoThumbnail from './VideoThumbnail';
import galleryService from '../../service/GalleryService';

const VideoThumbnails = (props) => {
  const {
    videos,
    onOpenVideo,
    thumbnailType,
    currentPage,
    thumbnailsPerPage
  } = props;

  const thumbnailsClasses = galleryService.getThumbnailsClasses(thumbnailType);
  let startIndex;
  let endIndex;

  //get paginated videos if enabled
  if (thumbnailsPerPage)
  {
    startIndex = (currentPage - 1) * parseInt(thumbnailsPerPage);
    endIndex = startIndex + parseInt(thumbnailsPerPage);
  }

  const videoThumbnailNodes = videos.map((video, i) =>
  {
    if (thumbnailsPerPage && i >= startIndex && i < endIndex)
      return <VideoThumbnail
        key={i}
        title={video.title}
        image={video.thumbnail.replace('.jpg', '@2x.jpg')}
        value={i}
        onOpenVideo={onOpenVideo}
      />;
    else if (!thumbnailsPerPage)
      return <VideoThumbnail
        key={i}
        title={video.title}
        image={video.thumbnail.replace('.jpg', '@2x.jpg')}
        value={i}
        onOpenVideo={onOpenVideo}
      />;
  });

  return (
    <ThumbnailsGrid className={thumbnailsClasses.join(' ')}>
      {videoThumbnailNodes}
    </ThumbnailsGrid>
  );
}

export default VideoThumbnails;
