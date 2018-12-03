import React from 'react';
import Tabs from '../shared/Tabs';
import Pane from '../shared/Pane';
import GalleryTabView from './GalleryTabView';
import AlbumTabView from './AlbumTabView';
import VideoTabView from './VideoTabView';
import GalleryAddTabView from './GalleryAddTabView';
import GalleryEditTabView from './GalleryEditTabView';
import AlbumAddTabView from './AlbumAddTabView';
import AlbumEditTabView from './AlbumEditTabView';
import VideoAddTabView from './VideoAddTabView';
import VideoEditTabView from './VideoEditTabView';
import PlaylistTabView from './PlaylistTabView';
import PlaylistAddTabView from './PlaylistAddTabView';
import PlaylistEditTabView from './PlaylistEditTabView';
import SettingsTabView from './SettingsTabView';
import UserFeedback from '../shared/UserFeedback';

class Dashboard extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      selectedGallery: undefined,
      selectedGalleryTitle: undefined,
      selectedAlbum: undefined,
      selectedAlbumTitle: undefined,
      currentView: undefined,
      currentViewID: undefined,
      feedbackMessage: undefined,
      feedbackType: undefined
    };

    this.feedbackTimeout = undefined;

    this.changeGallery = this.changeGallery.bind(this);
    this.changeAlbum = this.changeAlbum.bind(this);
    this.changeView = this.changeView.bind(this);
    this.setFeedbackMessage = this.setFeedbackMessage.bind(this);
  }

  changeGallery(id = undefined, title = undefined)
  {
    this.setState({
      selectedGallery: id,
      selectedGalleryTitle: title,
      selectedAlbum: undefined,
      currentView: undefined
    });

    scroll(0, 0);
  }

  changeAlbum(id = undefined, title = undefined)
  {
    this.setState({
      selectedAlbum: id,
      selectedAlbumTitle: title,
      currentView: undefined
    });

    scroll(0, 0);
  }

  changeView(view = undefined, id = undefined)
  {
    this.setState({
      currentView: view,
      currentViewID: id
    });

    scroll(0, 0);
  }

  getGalleriesTab()
  {
    const {
      currentView,
      currentViewID,
      selectedGallery,
      selectedGalleryTitle,
      selectedAlbum,
      selectedAlbumTitle
    } = this.state;

    if (currentView == 'addGallery')
      return <GalleryAddTabView
        changeView={this.changeView}
        setFeedbackMessage={this.setFeedbackMessage}
      />
    else if (currentView == 'editGallery')
      return <GalleryEditTabView
        changeView={this.changeView}
        currentViewID={currentViewID}
        setFeedbackMessage={this.setFeedbackMessage}
      />
    else if (currentView == 'addAlbum')
      return <AlbumAddTabView
        changeView={this.changeView}
        changeGallery={this.changeGallery}
        selectedGallery={selectedGallery}
        selectedGalleryTitle={selectedGalleryTitle}
        setFeedbackMessage={this.setFeedbackMessage}
      />
    else if (currentView == 'editAlbum')
      return <AlbumEditTabView
        changeView={this.changeView}
        changeGallery={this.changeGallery}
        changeAlbum={this.changeAlbum}
        currentViewID={currentViewID}
        selectedGalleryTitle={selectedGalleryTitle}
        setFeedbackMessage={this.setFeedbackMessage}
      />
    else if (currentView == 'addVideo')
      return <VideoAddTabView
        changeView={this.changeView}
        changeGallery={this.changeGallery}
        changeAlbum={this.changeAlbum}
        selectedGalleryTitle={selectedGalleryTitle}
        selectedAlbum={selectedAlbum}
        selectedAlbumTitle={selectedAlbumTitle}
        setFeedbackMessage={this.setFeedbackMessage}
      />
    else if (currentView == 'editVideo')
      return <VideoEditTabView
        changeView={this.changeView}
        changeGallery={this.changeGallery}
        changeAlbum={this.changeAlbum}
        currentViewID={currentViewID}
        selectedGallery={selectedGallery}
        selectedGalleryTitle={selectedGalleryTitle}
        selectedAlbumTitle={selectedAlbumTitle}
        setFeedbackMessage={this.setFeedbackMessage}
      />
    else if (selectedAlbum != undefined)
      return <VideoTabView
        selectedGallery={selectedGallery}
        selectedGalleryTitle={selectedGalleryTitle}
        selectedAlbum={selectedAlbum}
        selectedAlbumTitle={selectedAlbumTitle}
        changeView={this.changeView}
        changeGallery={this.changeGallery}
        changeAlbum={this.changeAlbum}
      />
    else if (selectedGallery != undefined)
      return <AlbumTabView
        changeAlbum={this.changeAlbum}
        changeGallery={this.changeGallery}
        selectedGallery={selectedGallery}
        selectedGalleryTitle={selectedGalleryTitle}
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
    const {
      currentView,
      currentViewID,
    } = this.state;

    if (currentView == 'addPlaylist')
      return <PlaylistAddTabView
        changeView={this.changeView}
        setFeedbackMessage={this.setFeedbackMessage}
      />
    else if (currentView == 'editPlaylist')
      return <PlaylistEditTabView
        changeView={this.changeView}
        currentViewID={currentViewID}
        setFeedbackMessage={this.setFeedbackMessage}
      />
    else
      return <PlaylistTabView
        changeView={this.changeView}
      />
  }

  setFeedbackMessage(message, type, timeout = 5000)
  {
    //set message
    this.setState(
    {
      feedbackMessage: message,
      feedbackType: type
    });

    //clear past timeout if need be
    clearTimeout(this.feedbackTimeout);

    //timeout to remove message
    this.feedbackTimeout = setTimeout(
      () => {
        this.setState(
        {
          feedbackMessage: undefined,
          feedbackType: undefined
        });
      },
      timeout
    );
  }

  render()
  {
    return (
      <div className="wrap utv-dashboard">
        <h2 id="utv-masthead">uTubeVideo Gallery</h2>
        <UserFeedback
          message={this.state.feedbackMessage}
          type={this.state.feedbackType}
        />
        <Tabs>
          <Pane label="Galleries" iconClass="tabs-icon-photos">
            {this.getGalleriesTab()}
          </Pane>
          <Pane label="Saved Playlists" iconClass="tabs-icon-list">
            {this.getPlaylistsTab()}
          </Pane>
          <Pane label="Settings" iconClass="tabs-icon-cog">
            <SettingsTabView
              setFeedbackMessage={this.setFeedbackMessage}
            />
          </Pane>
        </Tabs>
      </div>
    );
  }
}

export default Dashboard;
