import React from 'react';
import Tabs from '../shared/Tabs';
import Pane from '../shared/Pane';
import GalleryTabView from './GalleryTabView';
import AlbumTabView from './AlbumTabView';
import VideoTabView from './VideoTabView';
import GalleryAddTabView from './GalleryAddTabView';
import AlbumAddTabView from './AlbumAddTabView';
import VideoAddTabView from './VideoAddTabView';
import SettingsTabView from './SettingsTabView';
import PlaylistTable from './PlaylistTable';

class Dashboard extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      selectedGallery: undefined,
      selectedAlbum: undefined,
      currentView: undefined
    };

    this.changeGallery = this.changeGallery.bind(this);
    this.changeAlbum = this.changeAlbum.bind(this);
    this.changeView = this.changeView.bind(this);
  }

  changeGallery(value)
  {
    this.setState({
      selectedGallery: value,
      selectedAlbum: undefined
    });
  }

  changeAlbum(value)
  {
    this.setState({selectedAlbum: value});
  }

  changeView(view)
  {
    this.setState({currentView: view});
  }

  getGalleriesTab()
  {
    if (this.state.currentView == 'addGallery')
      return <GalleryAddTabView
        changeView={this.changeView}
      />
    else if (this.state.currentView == 'addAlbum')
      return <AlbumAddTabView
        changeView={this.changeView}
      />
    else if (this.state.currentView == 'addVideo')
      return <VideoAddTabView
        changeView={this.changeView}
      />
    else if (this.state.selectedAlbum != undefined)
      return <VideoTabView
        selectedGallery={this.state.selectedGallery}
        selectedAlbum={this.state.selectedAlbum}
        changeView={this.changeView}
        changeGallery={this.changeGallery}
        changeAlbum={this.changeAlbum}
      />
    else if (this.state.selectedGallery != undefined)
      return <AlbumTabView
        changeAlbum={this.changeAlbum}
        changeGallery={this.changeGallery}
        selectedGallery={this.state.selectedGallery}
        changeView={this.changeView}
      />
    else
      return <GalleryTabView
        changeGallery={this.changeGallery}
        changeView={this.changeView}
      />
  }

  getPlaylistsTab()
  {
    return <PlaylistTable
      changeGallery={this.changeGallery}
    />
  }

  render()
  {
    return (
      <div className="wrap utv-admin">
        <h2 id="utv-masthead">uTubeVideo Gallery</h2>
        <Tabs>
          <Pane label="Galleries" iconClass="fa-gear">
            {this.getGalleriesTab()}
          </Pane>
          <Pane label="Playlists" iconClass="fa-gear">
            {this.getPlaylistsTab()}
          </Pane>
          <Pane label="Settings" iconClass="fa-gear">
            <SettingsTabView/>
          </Pane>
        </Tabs>
      </div>
    );
  }
}

export default Dashboard;
