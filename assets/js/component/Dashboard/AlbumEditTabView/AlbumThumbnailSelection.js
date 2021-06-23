import React from 'react';
import classnames from 'classnames';

const AlbumThumbnailSelection = ({
  currentThumbnail,
  thumbnails,
  updateThumbnail
}) => {
  return <div className="utv-album-thumbnail-selection">

    {thumbnails.map(thumbnail => {
      return <div
        className={classnames('utv-album-thumbnail-choice', {
          'utv-album-thumbnail-choice-active': thumbnail.thumbnail == currentThumbnail
        })}
        key={thumbnail.thumbnail}
        onClick={() => updateThumbnail(thumbnail.thumbnail)}
      >
        <img className="utv-preview-thumbnail" src={utvJSData.thumbnailCacheDirectory + thumbnail.thumbnail + '.jpg'}/>
        <span className="utv-album-thumbnail-selected-overlay"></span>
      </div>
    })}

  </div>
}

AlbumThumbnailSelection.defaultProps = {
  thumbnails: []
}

export default AlbumThumbnailSelection;
