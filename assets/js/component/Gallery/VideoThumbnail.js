import React from 'react';
import RetinaImage from 'react-retina-image';

const VideoThumbnail = (props) =>
{
  const {
    title,
    image,
    value,
    onOpenVideo
  } = props;

  return (
    <div className="utv-thumbnail" onClick={() => onOpenVideo(value)}>
      <a>
        <span className="utv-play-btn"></span>
        <RetinaImage src={image}/>
      </a>
      <span>{title}</span>
    </div>
  );
}

export default VideoThumbnail;
