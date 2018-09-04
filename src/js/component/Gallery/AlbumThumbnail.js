import React from 'react';

const AlbumThumbnail = ({title, image, value, onChangeAlbum}) =>
{
  return (
    <div className='utv-thumb utv-album'>
      <img onClick={() => onChangeAlbum(value)} src={image} data-rjs='2'/>
      <span>{title}</span>
    </div>
  );
}

export default AlbumThumbnail;
