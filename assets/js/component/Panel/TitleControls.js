import React from 'react';

const Controls = ({videoData, onPreviousVideo, onNextVideo}) => {
  return <div className="utv-panel-controls">
    <i className="fa fa-chevron-left utv-panel-bkarrow" onClick={onPreviousVideo}></i>
    <span className="utv-panel-title">{videoData.title}</span>
    <i className="fa fa-chevron-right utv-panel-fwarrow" onClick={onNextVideo}></i>
    <div className="utv-clear"></div>
  </div>
}

export default Controls;
