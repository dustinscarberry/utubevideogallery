import React from 'react';
import Thumbnail from './Thumbnail';

class Thumbnails extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  componentDidMount()
  {
    let self = this;

    this.setFlow();

    window.onresize = function(event)
    {
      self.setFlow();
    };
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
    let startIndex = (this.props.currentPage - 1) * this.props.videosPerPage;
    let endIndex = startIndex + this.props.videosPerPage;

    let thumbnails = this.props.videos.map((e, i) =>
    {
      if (i >= startIndex && i < endIndex)
        return (<Thumbnail
          key={i}
          title={e.title}
          image={e.thumbnail}
          value={i}
          selected={i == this.props.selectedVideo ? true : false}
          onChangeVideo={this.props.onChangeVideo}
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

export default Thumbnails;
