import React from 'react';
import classnames from 'classnames';

const PlaylistPreviewItem = ({
  video,
  index,
  toggleVideoSelection,
  changeVideoTitle
}) => {
  // set thumbnail classes
  const thumbnailClasses = ['utv-playlist-item-thumbnail'];
  if (video.selected)
    thumbnailClasses.push('utv-playlist-item-thumbnail-active');

  // set legend classes
  const legendClasses = [];
  if (video.legend == 'local')
    legendClasses.push('utv-playlist-item-legend-local');
  else if (video.legend == 'web')
    legendClasses.push('utv-playlist-item-legend-web');
  else if (video.legend == 'both')
    legendClasses.push('utv-playlist-item-legend-both');

  return (
    <div className="utv-playlist-item">
      <span className="utv-playlist-item-number">{index + 1})</span>
      <div
        className={classnames(thumbnailClasses)}
        onClick={() => toggleVideoSelection(index)}
      >
        <img src={video.thumbnail}/>
        <span className="utv-playlist-selected-overlay"></span>
      </div>
      <div className="utv-playlist-item-form utv-formfield">
        <input
          type="text"
          className="utv-playlist-item-title"
          value={video.title}
          onChange={(e) => changeVideoTitle(index, e)}
        />
      <span className={classnames(legendClasses)}></span>
      </div>
    </div>
  );
}

export default PlaylistPreviewItem;
