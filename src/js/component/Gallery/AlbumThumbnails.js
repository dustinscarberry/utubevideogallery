import React from 'react';
import Thumbnails from '../shared/Thumbnails';
import AlbumThumbnail from './AlbumThumbnail';

const AlbumThumbnails = (props) =>
{
  const {
    albums,
    onChangeAlbum,
    thumbnailType
  } = props;

  const thumbnailsClasses = ['utv-video-panel-thumbnails', 'utv-align-center'];

  if (thumbnailType == 'square')
    thumbnailsClasses.push('utv-thumbnails-square');
  else
    thumbnailsClasses.push('utv-thumbnails-rectangle');

  const albumThumbnails = albums.map((album, i) =>
  {
    return (<AlbumThumbnail
      key={i}
      title={album.title}
      image={album.thumbnail}
      value={i}
      onChangeAlbum={onChangeAlbum}
    />);
  });

  return (
    <Thumbnails className={thumbnailsClasses.join(' ')}>
      {albumThumbnails}
    </Thumbnails>
  );
}

export default AlbumThumbnails;
