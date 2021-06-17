import React from 'react';
import ThumbnailsGrid from 'component/shared/ThumbnailsGrid';
import VideoThumbnail from './VideoThumbnail';
import { getThumbnailsClasses } from 'helpers/gallery-helpers';

const VideoThumbnails = ({videos, onOpenVideo, thumbnailType, currentPage, thumbnailsPerPage}) => {
  let startIndex;
  let endIndex;

  // get paginated videos if enabled
  if (thumbnailsPerPage) {
    startIndex = (currentPage - 1) * parseInt(thumbnailsPerPage);
    endIndex = startIndex + parseInt(thumbnailsPerPage);
  }

  const videoThumbnailNodes = videos.map((video, i) => {
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

  return <ThumbnailsGrid classes={getThumbnailsClasses(thumbnailType)}>
    {videoThumbnailNodes}
  </ThumbnailsGrid>
}

export default VideoThumbnails;
