import React from 'react';
import VideoTable from './PlaylistTable';
import Breadcrumbs from '../shared/Breadcrumbs';
import PlaylistTable from './PlaylistTable';

class PlaylistTabView extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return (
      <div>
        <div className="utv-actionbar" style={{'margin': '20px 0'}}>
          <button className="utv-link-submit-button" onClick={() => this.props.changeView('addPlaylist')}>Add Playlist</button>
        </div>
        <Breadcrumbs
          crumbs={[
            {text: 'Saved Playlists'}
          ]}
        />
        <PlaylistTable
          changeView={this.props.changeView}
        />
      </div>
    );
  }
}

export default PlaylistTabView;
