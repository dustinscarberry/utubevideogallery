import '../scss/app.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Gallery from './component/Gallery/Gallery';
import Panel from './component/Panel/Panel';

const galleries = document.querySelectorAll('.utv-gallery-root');
const panels = document.querySelectorAll('.utv-panel-root');

Array.prototype.forEach.call(panels, function(panel)
{
  ReactDOM.render(
    <Panel
      id={panel.getAttribute('data-id')}
      videosPerPage={panel.getAttribute('data-videos-per-page')}
      controls={panel.getAttribute('data-controls')}
      theme={panel.getAttribute('data-theme')}
      icon={panel.getAttribute('data-icon')}
    />, panel);
});

Array.prototype.forEach.call(galleries, function(gallery)
{
  ReactDOM.render(
    <Gallery
      id={gallery.getAttribute('data-id')}
    />
  , gallery);
});
