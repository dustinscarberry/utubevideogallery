import React from 'react';
import Thumbnails from '../shared/Thumbnails';
import AlbumThumbnail from './AlbumThumbnail';
import galleryService from '../../service/GalleryService';

const AlbumThumbnails = (props) =>
{
  const {
    albums,
    onChangeAlbum,
    thumbnailType,
    currentPage,
    thumbnailsPerPage
  } = props;

  const thumbnailsClasses = galleryService.getThumbnailsClasses(thumbnailType);
  let startIndex = undefined;
  let endIndex = undefined;

  //get paginated videos if enabled
  if (thumbnailsPerPage)
  {
    startIndex = (currentPage - 1) * parseInt(thumbnailsPerPage);
    endIndex = startIndex + parseInt(thumbnailsPerPage);
  }

  const albumThumbnailNodes = albums.map((album, i) =>
  {
    if (thumbnailsPerPage && i >= startIndex && i < endIndex)
      return <AlbumThumbnail
        key={i}
        title={album.title}
        image={album.thumbnail}
        value={i}
        onChangeAlbum={onChangeAlbum}
      />;
    else if (!thumbnailsPerPage)
      return <AlbumThumbnail
        key={i}
        title={album.title}
        image={album.thumbnail}
        value={i}
        onChangeAlbum={onChangeAlbum}
      />;
  });

  return (
    <Thumbnails className={thumbnailsClasses.join(' ')}>
      {albumThumbnailNodes}
    </Thumbnails>
  );
}

export default AlbumThumbnails;
