import React from 'react';
import RetinaImage from 'react-retina-image';

const Thumbnail = (props) =>
{
  const {
    title,
    image,
    value,
    selected,
    onChangeVideo
  } = props;

  const thumbnailClasses = ['utv-thumb'];

  if (selected)
    thumbnailClasses.push('utv-panel-video-active');

  return (
    <div className={thumbnailClasses.join(' ')} onClick={() => onChangeVideo(value)}>
      <a>
        <span className="utv-play-btn"></span>
        <RetinaImage src={image}/>
      </a>
      <span>{title}</span>
    </div>
  );
}

export default Thumbnail;
