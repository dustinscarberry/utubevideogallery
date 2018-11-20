import React from 'react';

const PlaylistVideoSelection = (props) =>
{
  const {
    videos,
    toggleVideoSelection,
    changePlaylistVideoTitle
  } = props;

  let thumbnailNodes = videos.map((video, index) =>
  {
    let thumbnailClasses = ['utv-playlist-choice'];

    if (video.selected)
      thumbnailClasses.push('utv-playlist-choice-active');

    return (
      <div id="utv-playlist-preview" onClick={() => toggleVideoSelection(index)}>
        <div className="utv-playlist-preview-item">
          <span className="utv-playlist-preview-item-num">{index})</span>
          <div className={thumbnailClasses.join(' ')}>
            <img src={video.thumbnail}/>
            <span className="utv-playlist-choice-overlay"></span>
          </div>
          <div class="utv-playlist-preview-form">
            <input type="text" className="utv-playlist-item-title" value={video.title} onChange={changePlaylistVideoTitle}/>
            <span class="utv-playlist-both"></span>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div>
      {thumbnailNodes}
    </div>
  );
}

export default PlaylistVideoSelection;
