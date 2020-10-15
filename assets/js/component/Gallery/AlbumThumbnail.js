import React from 'react';

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
