import React from 'react';

const VideoThumbnail = ({title, image, value, onOpenVideo}) =>
{
  return (
    <div className='utv-thumb' onClick={() => onOpenVideo(value)}>
      <a>
        <span className="utv-play-btn"></span>
        <img src={image} data-rjs="2"/>
      </a>
      <span>{title}</span>
    </div>
  );
}

export default VideoThumbnail;
