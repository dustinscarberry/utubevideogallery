import React from 'react';
import AlbumThumbnail from './AlbumThumbnail';

class AlbumThumbnails extends React.Component
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
    console.log(this.refs.outerContainer);
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
    let thumbnails = this.props.albums.map((e, i) =>
    {
      return (<AlbumThumbnail
        key={i}
        title={e.title}
        image={e.thumbnail}
        value={i}
        onChangeAlbum={this.props.onChangeAlbum}
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

export default AlbumThumbnails;
