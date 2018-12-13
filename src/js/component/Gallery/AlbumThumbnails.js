import React from 'react';
import Thumbnails from '../shared/Thumbnails';
import AlbumThumbnail from './AlbumThumbnail';
import galleryService from '../../service/GalleryService';

const AlbumThumbnails = (props) =>
{
  const {
    albums,
    onChangeAlbum,
    thumbnailType
  } = props;

  const thumbnailsClasses = galleryService.getThumbnailsClasses(thumbnailType);

  const albumThumbnailNodes = albums.map((album, i) =>
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
      {albumThumbnailNodes}
    </Thumbnails>
  );
}

export default AlbumThumbnails;
