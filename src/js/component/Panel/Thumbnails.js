import React from 'react';
import Thumbnail from './Thumbnail';

const Thumbnails = ({videos, selectedVideo, currentPage, perPage, onChangeVideo}) =>
{
  let startIndex = (currentPage - 1) * perPage;
  let endIndex = startIndex + perPage;

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
    <div className="utv-video-panel-thumbnails utv-align-center">
      <div className="utv-inner-wrapper" style={{'width': '1080px'}}>
        {thumbnails}
      </div>
    </div>
  );
}

export default Thumbnails;
