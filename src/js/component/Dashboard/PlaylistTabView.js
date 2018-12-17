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
          <button className="button-secondary" onClick={() => this.props.changeView('addPlaylist')}>{utvJSData.localization.addPlaylist}</button>
        </div>
        <Breadcrumbs
          crumbs={[
            {text: utvJSData.localization.savedPlaylists}
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
