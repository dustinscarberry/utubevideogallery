import React from 'react';

const AlbumThumbnailSelection = (props) =>
{
  const {
    currentThumbnail,
    thumbnails,
    updateThumbnail
  } = props;

  let thumbnailNodes = thumbnails.map(thumbnail =>
  {
    let thumbnailClasses = ['utv-album-thumb-choice'];

    if (thumbnail.thumbnail == currentThumbnail)
      thumbnailClasses.push('utv-album-thumb-choice-active');

    return <div
      className={thumbnailClasses.join(' ')}
      key={thumbnail.thumbnail}
      onClick={() => updateThumbnail(thumbnail.thumbnail)}
    >
      <img src={utvJSData.thumbnailCacheDirectory + thumbnail.thumbnail + '.jpg'}/>
      <span className="utv-album-thumb-overlay"></span>
    </div>
  });

  return (
    <div className="utv-album-thumbnail-selection">
      {thumbnailNodes}
    </div>
  );
}

export default AlbumThumbnailSelection;
