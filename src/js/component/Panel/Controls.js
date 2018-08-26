import React from 'react';

const Controls = ({videoData, onPreviousVideo, onNextVideo}) =>
{
  return (
    <div className="utv-video-panel-controls">
      <i className="fa fa-chevron-left utv-video-panel-bkarrow" onClick={onPreviousVideo}></i>
      <span className="utv-video-panel-title">{videoData.title}</span>
      <i className="fa fa-chevron-right utv-video-panel-fwarrow" onClick={onNextVideo}></i>
      <div className="utv-clear"></div>
    </div>
  );
}

export default Controls;
