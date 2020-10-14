import React from 'react';
import RetinaImage from 'react-retina-image';

const VideoThumbnail = ({title, image, value, onOpenVideo}) =>
{
  return (
    <div className="utv-thumbnail" onClick={() => onOpenVideo(value)}>
      <a>
        <span className="utv-play-btn"></span>
        <img src={image}/>
      </a>
      <span>{title}</span>
    </div>
  );
}

export default VideoThumbnail;
