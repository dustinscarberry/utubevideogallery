const PlaylistMultiSelect = ({videos, toggleAllVideosSelection}) => {
  // short circuit if no videos
  if (!videos || videos.length < 1)
    return null;

  // calculate videos selected and total
  const totalVideos = videos.length;
  const selectedVideos = videos.reduce((total, video) => {
    return video.selected ? total + 1 : total;
  }, 0);

  return <div className="utv-playlist-multiselect">
    <span className="utv-playlist-preview-selection-count">{'( ' + selectedVideos + ' / ' + totalVideos + ' )'}</span>
    <span className="utv-playlist-selection-toggle" onClick={() => toggleAllVideosSelection(true)}>{utvJSData.localization.all}</span>
    <span className="utv-playlist-selection-toggle" onClick={() => toggleAllVideosSelection(false)}>{utvJSData.localization.none}</span>
  </div>
}

export default PlaylistMultiSelect;
