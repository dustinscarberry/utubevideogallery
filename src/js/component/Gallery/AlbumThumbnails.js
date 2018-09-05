import React from 'react';
import Thumbnails from '../shared/Thumbnails';
import AlbumThumbnail from './AlbumThumbnail';

const AlbumThumbnails = ({albums, onChangeAlbum}) =>
{
  let albumThumbnails = albums.map((e, i) =>
  {
    return (<AlbumThumbnail
      key={i}
      title={e.title}
      image={e.thumbnail}
      value={i}
      onChangeAlbum={onChangeAlbum}
    />);
  });

  return (
    <Thumbnails className="utv-video-panel-thumbnails utv-align-center">
      {albumThumbnails}
    </Thumbnails>
  );
}

export default AlbumThumbnails;
