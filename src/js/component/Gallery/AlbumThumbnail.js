import React from 'react';
import RetinaImage from 'react-retina-image';

const AlbumThumbnail = ({title, image, value, onChangeAlbum}) =>
{
  return (
    <div className='utv-thumb utv-album' onClick={() => onChangeAlbum(value)}>
      <RetinaImage src={image}/>
      <span>{title}</span>
    </div>
  );
}

export default AlbumThumbnail;
