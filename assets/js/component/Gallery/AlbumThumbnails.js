import ThumbnailsGrid from 'component/shared/ThumbnailsGrid';
import AlbumThumbnail from './AlbumThumbnail';
import { getThumbnailsClasses } from 'helpers/gallery-helpers';

const AlbumThumbnails = ({albums, onChangeAlbum, thumbnailType, currentPage, thumbnailsPerPage}) => {
  let startIndex;
  let endIndex;

  // get paginated videos if enabled
  if (thumbnailsPerPage) {
    startIndex = (currentPage - 1) * parseInt(thumbnailsPerPage);
    endIndex = startIndex + parseInt(thumbnailsPerPage);
  }

  const albumThumbnailNodes = albums.map((album, i) => {
    if (thumbnailsPerPage && i >= startIndex && i < endIndex)
      return <AlbumThumbnail
        key={i}
        title={album.title}
        image={album.thumbnail.replace('.jpg', '@2x.jpg')}
        value={i}
        onChangeAlbum={onChangeAlbum}
      />;
    else if (!thumbnailsPerPage)
      return <AlbumThumbnail
        key={i}
        title={album.title}
        image={album.thumbnail.replace('.jpg', '@2x.jpg')}
        value={i}
        onChangeAlbum={onChangeAlbum}
      />;
  });

  return <ThumbnailsGrid classes={getThumbnailsClasses(thumbnailType)}>
    {albumThumbnailNodes}
  </ThumbnailsGrid>
}

export default AlbumThumbnails;
