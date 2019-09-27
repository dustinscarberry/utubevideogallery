import React from 'react';
import RetinaImage from 'react-retina-image';

const AlbumThumbnail = (props) =>
{
  const {
    title,
    image,
    value,
    onChangeAlbum
  } = props;

  return (
    <div className="utv-thumbnail utv-album" onClick={() => onChangeAlbum(value)}>
      <RetinaImage src={image}/>
      <span>{title}</span>
    </div>
  );
}

export default AlbumThumbnail;
