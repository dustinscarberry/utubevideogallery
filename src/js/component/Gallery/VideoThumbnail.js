import React from 'react';

const VideoThumbnail = ({title, image, value, selected, onChangeVideo}) =>
{
  let thumbnailClasses = ['utv-thumb'];

  if (selected)
    thumbnailClasses.push('utv-panel-video-active');

  return (
    <div className={thumbnailClasses.join(' ')} onClick={() => onChangeVideo(value)}>
      <a>
        <span className="utv-play-btn"></span>
        <img src={image} data-rjs="2"/>
      </a>
      <span>{title}</span>
    </div>
  );
}

export default VideoThumbnail;
