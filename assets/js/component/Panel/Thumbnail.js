import React from 'react';

const Thumbnail = (props) =>
{
  const {
    title,
    image,
    value,
    selected,
    onChangeVideo
  } = props;

  const thumbnailClasses = ['utv-thumbnail'];

  if (selected)
    thumbnailClasses.push('utv-panel-video-active');

  return (
    <div className={thumbnailClasses.join(' ')} onClick={() => onChangeVideo(value)}>
      <a>
        <span className="utv-play-btn"></span>
        <img src={image}/>
      </a>
      <span>{title}</span>
    </div>
  );
}

export default Thumbnail;
