import React from 'react';
import VideoThumbnail from './VideoThumbnail';

class VideoThumbnails extends React.Component
{
  constructor(props)
  {
    super(props);

    this.setFlow = this.setFlow.bind(this);
  }

  componentDidMount()
  {
    this.setFlow();
    window.addEventListener('resize', this.setFlow);
  }

  setFlow()
  {
    let outerWidth = this.refs.outerContainer.getBoundingClientRect().width;
    let windowWidth = document.documentElement.clientWidth;

    if (windowWidth < outerWidth)
      outerWidth = windowWidth;

    let thumbnailWidth = parseInt(utvJSData.thumbnailWidth);
    let thumbnailPadding = parseInt(utvJSData.thumbnailPadding);
    let thumbnailTotalWidth = thumbnailWidth + (thumbnailPadding * 2);

    let blocks = Math.floor(outerWidth / thumbnailTotalWidth);
    let innerSize = thumbnailTotalWidth * blocks;

    this.refs.innerContainer.style.width = innerSize + 'px';
  }

  render()
  {
    let thumbnails = this.props.videos.map((e, i) =>
    {
      return (<VideoThumbnail
        key={i}
        title={e.title}
        image={e.thumbnail}
        value={i}
        onOpenVideo={this.props.onOpenVideo}
      />);
    });

    return (
      <div className="utv-video-panel-thumbnails utv-align-center" ref="outerContainer">
        <div className="utv-inner-wrapper" ref="innerContainer">
          {thumbnails}
        </div>
      </div>
    );
  }
}

export default VideoThumbnails;
