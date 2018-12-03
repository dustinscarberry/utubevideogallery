import React from 'react';

const PlaylistLegend = (props) =>
{
  return (
    <ul className="utv-playlist-legend">
      <li className="utv-playlist-legend-local">
        Local
      </li>
      <li className="utv-playlist-legend-web">
        Web
      </li>
      <li className="utv-playlist-legend-both">
        Both
      </li>
    </ul>
  );
}

export default PlaylistLegend;
