import React from 'react';

class Thumbnails extends React.Component
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

  componentWillUnmount()
  {
    window.removeEventListener('resize', this.setFlow);
  }

  setFlow()
  {
    let outerWidth = this.refs.outerContainer.getBoundingClientRect().width;
    let windowWidth = document.documentElement.clientWidth;

    if (windowWidth < outerWidth)
      outerWidth = windowWidth;

    let thumbnailWidth = parseInt(utvJSData.setting.thumbnailWidth);
    let thumbnailPadding = parseInt(utvJSData.setting.thumbnailPadding);
    let thumbnailTotalWidth = thumbnailWidth + (thumbnailPadding * 2);

    let blocks = Math.floor(outerWidth / thumbnailTotalWidth);
    let innerSize = thumbnailTotalWidth * blocks;

    this.refs.innerContainer.style.width = innerSize + 'px';
  }

  render()
  {
    return (
      <div className={this.props.className} ref="outerContainer">
        <div className="utv-inner-wrapper" ref="innerContainer">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Thumbnails;
