import React from 'react';
import VideoThumbnails from './VideoThumbnails';
import galleryService from '../../service/GalleryService';

class VideoView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.openVideo = this.openVideo.bind(this);
  }

  openVideo(value)
  {
    const selectedVideo = this.props.videos[value];

    if (selectedVideo)
      this.props.onOpenVideoPopup(selectedVideo);
  }

  render()
  {
    const {
      iconType,
      thumbnailType,
      videos
    } = this.props;

    const galleryClasses = galleryService.getGalleryClasses(iconType);

    return (
      <div className={galleryClasses.join(' ')}>
        <VideoThumbnails
          videos={videos}
          onOpenVideo={this.openVideo}
          thumbnailType={thumbnailType}
        />
      </div>
    );
  }
}

export default VideoView;
