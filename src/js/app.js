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
      iconType={panel.getAttribute('data-icon')}
      maxVideos={panel.getAttribute('data-max-videos')}
    />, panel);
});

Array.prototype.forEach.call(galleries, function(gallery)
{
  ReactDOM.render(
    <Gallery
      id={gallery.getAttribute('data-id')}
      iconType={gallery.getAttribute('data-icontype')}
      maxAlbums={gallery.getAttribute('data-max-albums')}
      maxVideos={gallery.getAttribute('data-max-videos')}
    />
  , gallery);
});
