import React from 'react';
import classnames from 'classnames';
import VideoThumbnails from './VideoThumbnails';
import Paging from './Paging';
import { getGalleryClasses } from 'helpers/gallery-helpers';

class VideoView extends React.Component
{
  constructor(props) {
    super(props);
  }

  openVideo = (value) => {
    const selectedVideo = this.props.videos[value];
    if (selectedVideo)
      this.props.onOpenVideoPopup(selectedVideo);
  }

  getPagingNode() {
    // is pagination enabled
    if (!this.props.thumbnailsPerPage)
      return null;

    const {
      videos,
      currentPage,
      onChangePage
    } = this.props;

    // get total pages
    const totalPages = Math.ceil(videos.length / parseInt(this.props.thumbnailsPerPage));

    return <Paging
      currentPage={currentPage}
      totalPages={totalPages}
      onChangePage={onChangePage}
    />
  }

  render() {
    const {
      iconType,
      thumbnailType,
      videos,
      currentPage,
      thumbnailsPerPage,
      onChangePage
    } = this.props;

    return <div className={classnames(getGalleryClasses(iconType))}>
      <VideoThumbnails
        videos={videos}
        onOpenVideo={this.openVideo}
        thumbnailType={thumbnailType}
        currentPage={currentPage}
        thumbnailsPerPage={thumbnailsPerPage}
      />
      {this.getPagingNode()}
    </div>
  }
}

export default VideoView;
