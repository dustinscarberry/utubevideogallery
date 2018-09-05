import '../scss/app.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Gallery from './component/Gallery/Gallery';
import Panel from './component/Panel/Panel';

let galleries = document.querySelectorAll('.utv-gallery-root');
let panels = document.querySelectorAll('.utv-panel-root');

Array.prototype.forEach.call(panels, function(e)
{
  ReactDOM.render(
    <Panel
      id={e.getAttribute('data-id')}
      videosPerPage={e.getAttribute('data-videos-per-page')}
      controls={e.getAttribute('data-controls')}
      theme={e.getAttribute('data-theme')}
      icon={e.getAttribute('data-icon')}
    />, e);
});

Array.prototype.forEach.call(galleries, function(e)
{
  ReactDOM.render(
    <Gallery
      id={e.getAttribute('data-id')}
    />
  , e);
});
