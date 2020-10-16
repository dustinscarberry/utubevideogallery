import React from 'react';
import PlaylistPreviewItem from '../shared/PlaylistPreviewItem';

const PlaylistVideoSelection = ({videos, toggleVideoSelection, changeVideoTitle}) => {
  const previewItemNodes = videos.map((video, index) => {
    return <PlaylistPreviewItem
      key={index}
      video={video}
      index={index}
      toggleVideoSelection={toggleVideoSelection}
      changeVideoTitle={changeVideoTitle}
    />;
  });

  return (
    <div className="utv-playlist-preview">
      {previewItemNodes}
    </div>
  );
}

export default PlaylistVideoSelection;
