import React from 'react';
import Thumbnails from '../shared/Thumbnails';
import Thumbnail from './Thumbnail';

const PanelThumbnails = (props) =>
{
  const {
    videos,
    selectedVideo,
    currentPage,
    videosPerPage,
    onChangeVideo
  } = props;

  const startIndex = (currentPage - 1) * parseInt(videosPerPage);
  const endIndex = startIndex + parseInt(videosPerPage);

  const thumbnailNodes = videos.map((video, i) =>
  {
    if (i >= startIndex && i < endIndex)
      return (<Thumbnail
        key={i}
        title={video.title}
        image={video.thumbnail}
        value={i}
        selected={i == selectedVideo ? true : false}
        onChangeVideo={onChangeVideo}
      />);
  });

  return (
    <Thumbnails className="utv-video-panel-thumbnails utv-align-center">
      {thumbnailNodes}
    </Thumbnails>
  );
}

export default PanelThumbnails;
