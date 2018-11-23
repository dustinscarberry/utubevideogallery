import React from 'react';

const PlaylistVideoSelection = (props) =>
{
  const {
    videos,
    toggleVideoSelection,
    changeVideoTitle
  } = props;

  let thumbnailNodes = videos.map((video, index) =>
  {
    let thumbnailClasses = ['utv-playlist-choice'];

    if (video.selected)
      thumbnailClasses.push('utv-playlist-choice-active');

    return (
      <div key={index} id="utv-playlist-preview">
        <div className="utv-playlist-preview-item">
          <span className="utv-playlist-preview-item-num">{index + 1})</span>
          <div className={thumbnailClasses.join(' ')} onClick={() => toggleVideoSelection(index)}>
            <img src={video.thumbnail}/>
            <span className="utv-playlist-choice-overlay"></span>
          </div>
          <div className="utv-playlist-preview-form">
            <input type="text" className="utv-playlist-item-title" value={video.title} onChange={(e) => changeVideoTitle(index, e)}/>
            <span className="utv-playlist-both"></span>
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
