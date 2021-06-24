import '../scss/app.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Gallery from './component/Gallery';
import Panel from './component/Panel';

const panels = document.querySelectorAll('.utv-panel-root');
if (panels)
  Array.prototype.forEach.call(panels, panel => {
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

const galleries = document.querySelectorAll('.utv-gallery-root');
if (galleries)
  Array.prototype.forEach.call(galleries, gallery => {
    ReactDOM.render(
      <Gallery
        id={gallery.getAttribute('data-id')}
        iconType={gallery.getAttribute('data-icontype')}
        maxAlbums={gallery.getAttribute('data-max-albums')}
        maxVideos={gallery.getAttribute('data-max-videos')}
        thumbnailsPerPage={gallery.getAttribute('data-thumbnails-per-page')}
      />
    , gallery);
  });
