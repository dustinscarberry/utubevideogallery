import React from 'react';
import AlbumThumbnails from './AlbumThumbnails';
import VideoThumbnails from './VideoThumbnails';
import BreadCrumb from './BreadCrumb';

class AlbumView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      selectedAlbum: undefined
    };

    this.changeAlbum = this.changeAlbum.bind(this);
    this.resetAlbum = this.resetAlbum.bind(this);
    this.openVideo = this.openVideo.bind(this);
  }

  changeAlbum(albumIndex)
  {
    this.setState({selectedAlbum: albumIndex});
  }

  resetAlbum()
  {
    this.changeAlbum(undefined);
  }

  openVideo(value)
  {
    let selectedVideo = this.props.albums[this.state.selectedAlbum].videos[value];

    if (selectedVideo)
      this.props.onOpenVideoPopup(selectedVideo);
  }

  render()
  {
    let thumbnails = undefined;
    let albumName = undefined;
    let containerClasses = ['utv-gallery'];

    if (true)
      containerClasses.push('utv-icon-red');



    let album = this.props.albums[this.state.selectedAlbum] || undefined;
    if (album)
      albumName = album.title;

    if (this.state.selectedAlbum != undefined)
      thumbnails = <VideoThumbnails
        videos={album.videos}
        onOpenVideo={this.openVideo}
      />;
    else
    {
      thumbnails = <AlbumThumbnails
        albums={this.props.albums}
        onChangeAlbum={this.changeAlbum}
      />;

      containerClasses.push(['utv-albums']);
    }

    return (
      <div className={containerClasses.join(' ')}>
        <BreadCrumb
          albumName={albumName}
          onResetAlbum={this.resetAlbum}
        />
        {thumbnails}
      </div>
    );
  }
}

export default AlbumView;
