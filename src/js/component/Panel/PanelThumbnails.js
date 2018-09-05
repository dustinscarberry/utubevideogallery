import React from 'react';
import Thumbnails from '../shared/Thumbnails';
import Thumbnail from './Thumbnail';

const PanelThumbnails = ({videos, selectedVideo, currentPage, videosPerPage, onChangeVideo}) =>
{
  let startIndex = (currentPage - 1) * videosPerPage;
  let endIndex = startIndex + videosPerPage;

  let thumbnails = videos.map((e, i) =>
  {
    if (i >= startIndex && i < endIndex)
      return (<Thumbnail
        key={i}
        title={e.title}
        image={e.thumbnail}
        value={i}
        selected={i == selectedVideo ? true : false}
        onChangeVideo={onChangeVideo}
      />);
  });

  return (
    <Thumbnails className="utv-video-panel-thumbnails utv-align-center">
      {thumbnails}
    </Thumbnails>
  );
}

export default PanelThumbnails;
