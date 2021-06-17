import React from 'react';
import classnames from 'classnames';
import AlbumThumbnails from './AlbumThumbnails';
import VideoThumbnails from './VideoThumbnails';
import BreadCrumb from './BreadCrumb';
import Paging from './Paging';
import { getGalleryClasses } from 'helpers/gallery-helpers';

class AlbumView extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      selectedAlbum: undefined
    };
  }

  changeAlbum = (albumIndex) => {
    this.setState({selectedAlbum: albumIndex});

    // reset current page to 1
    this.props.onChangePage(1);
  }

  openVideo = (value) => {
    let selectedVideo = this.props.albums[this.state.selectedAlbum].videos[value];

    if (selectedVideo)
      this.props.onOpenVideoPopup(selectedVideo);
  }

  getThumbnailsNode = () => {
    const {
      thumbnailType,
      albums,
      currentPage,
      thumbnailsPerPage
    } = this.props;

    const album = albums[this.state.selectedAlbum];

    if (this.state.selectedAlbum != undefined)
      return <VideoThumbnails
        videos={album.videos}
        onOpenVideo={this.openVideo}
        thumbnailType={thumbnailType}
        currentPage={currentPage}
        thumbnailsPerPage={thumbnailsPerPage}
      />;
    else
      return <AlbumThumbnails
        albums={albums}
        onChangeAlbum={this.changeAlbum}
        thumbnailType={thumbnailType}
        currentPage={currentPage}
        thumbnailsPerPage={thumbnailsPerPage}
      />;
  }

  getPagingNode = () => {
    // return if pagination not enabled
    if (!this.props.thumbnailsPerPage)
      return null;

    const {
      albums,
      currentPage,
      onChangePage
    } = this.props;

    // get total pages
    let totalPages;
    const thumbnailsPerPage = parseInt(this.props.thumbnailsPerPage);

    if (this.state.selectedAlbum != undefined)
      totalPages = Math.ceil(albums[this.state.selectedAlbum].videos.length / thumbnailsPerPage);
    else
      totalPages = Math.ceil(albums.length / thumbnailsPerPage);

    // return paging component
    return <Paging
      currentPage={currentPage}
      totalPages={totalPages}
      onChangePage={onChangePage}
    />
  }

  getSelectedAlbumName = () => {
    const album = this.props.albums[this.state.selectedAlbum];

    if (album)
      return album.title;

    return undefined;
  }

  render() {
    const {
      iconType,
      thumbnailType,
      currentPage,
      totalPages,
      onChangePage
    } = this.props;

    const galleryClasses = getGalleryClasses(
      iconType,
      this.state.selectedAlbum
    );

    return <div className={classnames(galleryClasses)}>
      <BreadCrumb
        albumName={this.getSelectedAlbumName()}
        changeAlbum={this.changeAlbum}
      />
      {this.getThumbnailsNode()}
      {this.getPagingNode()}
    </div>
  }
}

export default AlbumView;
