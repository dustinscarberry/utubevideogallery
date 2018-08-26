import React from 'react';
import VideoPlayer from './VideoPlayer';
import Controls from './Controls';
import Thumbnails from './Thumbnails';
import Paging from './Paging';

const Panel = ({videos, selectedVideo, thumbnailType, onPreviousVideo, onNextVideo, onChangeVideo, currentPage, totalPages, onChangePage, perPage}) =>
{
  //get selected video data
  let selectedVideoData = videos[selectedVideo];

  return (
    <div className="utv-panel utv-panel-light utv-icon-red" data-panel-video-count="14" data-visible-controls="false">
      <VideoPlayer
        videoData={selectedVideoData}
      />
      <Controls
        videoData={selectedVideoData}
        onPreviousVideo={onPreviousVideo}
        onNextVideo={onNextVideo}
      />
      <Thumbnails
        videos={videos}
        selectedVideo={selectedVideo}
        onChangeVideo={onChangeVideo}
        currentPage={currentPage}
        perPage={perPage}
      />
      <Paging
        currentPage={currentPage}
        totalPages={totalPages}
        onChangePage={onChangePage}
      />
    </div>
  );
}

export default Panel;
