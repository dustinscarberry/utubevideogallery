import React from 'react';

const PlaylistLegend = (props) => {
  return <ul className="utv-playlist-legend">
    <li className="utv-playlist-legend-local">
      {utvJSData.localization.local}
    </li>
    <li className="utv-playlist-legend-web">
      {utvJSData.localization.web}
    </li>
    <li className="utv-playlist-legend-both">
      {utvJSData.localization.both}
    </li>
  </ul>
}

export default PlaylistLegend;
