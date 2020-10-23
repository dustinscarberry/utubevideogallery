import React from 'react';

const AlbumThumbnailSelection = ({currentThumbnail, thumbnails, updateThumbnail}) =>
{
  const thumbnailNodes = thumbnails.map(thumbnail =>
  {
    const thumbnailClasses = ['utv-album-thumbnail-choice'];

    if (thumbnail.thumbnail == currentThumbnail)
      thumbnailClasses.push('utv-album-thumbnail-choice-active');

    return <div
      className={thumbnailClasses.join(' ')}
      key={thumbnail.thumbnail}
      onClick={() => updateThumbnail(thumbnail.thumbnail)}
    >
      <img src={utvJSData.thumbnailCacheDirectory + thumbnail.thumbnail + '.jpg'} className="utv-preview-thumbnail"/>
      <span className="utv-album-thumbnail-selected-overlay"></span>
    </div>
  });

  return (
    <div className="utv-album-thumbnail-selection">
      {thumbnailNodes}
    </div>
  );
}

AlbumThumbnailSelection.defaultProps = {
  thumbnails: []
};

export default AlbumThumbnailSelection;
