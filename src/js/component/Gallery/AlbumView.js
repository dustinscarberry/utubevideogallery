import React from 'react';
import AlbumThumbnails from './AlbumThumbnails';
import VideoThumbnails from './VideoThumbnails';
import BreadCrumb from './BreadCrumb';
import galleryService from '../../service/GalleryService';

class AlbumView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      selectedAlbum: undefined
    };

    this.changeAlbum = this.changeAlbum.bind(this);
    this.openVideo = this.openVideo.bind(this);
  }

  changeAlbum(albumIndex)
  {
    this.setState({selectedAlbum: albumIndex});
  }

  openVideo(value)
  {
    let selectedVideo = this.props.albums[this.state.selectedAlbum].videos[value];

    if (selectedVideo)
      this.props.onOpenVideoPopup(selectedVideo);
  }

  getThumbnailsNode()
  {
    const {
      thumbnailType,
      albums
    } = this.props;

    const album = albums[this.state.selectedAlbum];

    if (this.state.selectedAlbum != undefined)
      return <VideoThumbnails
        videos={album.videos}
        onOpenVideo={this.openVideo}
        thumbnailType={thumbnailType}
      />;
    else
      return <AlbumThumbnails
        albums={albums}
        onChangeAlbum={this.changeAlbum}
        thumbnailType={thumbnailType}
      />;
  }

  getSelectedAlbumName()
  {
    const album = this.props.albums[this.state.selectedAlbum];

    if (album)
      return album.title;

    return undefined;
  }

  render()
  {
    const {
      iconType,
      thumbnailType,
    } = this.props;

    const galleryClasses = galleryService.getGalleryClasses(
      iconType,
      this.state.selectedAlbum
    );

    return (
      <div className={galleryClasses.join(' ')}>
        <BreadCrumb
          albumName={this.getSelectedAlbumName()}
          changeAlbum={this.changeAlbum}
        />
        {this.getThumbnailsNode()}
      </div>
    );
  }
}

export default AlbumView;
