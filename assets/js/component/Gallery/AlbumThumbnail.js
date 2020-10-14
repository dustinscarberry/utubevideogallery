import React from 'react';
import RetinaImage from 'react-retina-image';

const AlbumThumbnail = ({title, image, value, onChangeAlbum}) =>
{
  return (
    <div className="utv-thumbnail utv-album" onClick={() => onChangeAlbum(value)}>
      <img src={image}/>
      <span>{title}</span>
    </div>
  );
}

export default AlbumThumbnail;
