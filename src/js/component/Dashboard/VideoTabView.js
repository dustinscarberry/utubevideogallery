import React from 'react';
import VideoTable from './VideoTable';

class VideoTabView extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return (
      <div>
        <div className="utv-actionbar" style={{'margin': '20px 0'}}>
          <button className="utv-link-submit-button" onClick={() => this.props.changeView('addVideo')}>Add Video</button>
        </div>
        <div className="utv-breadcrumbs">
          <a tabIndex="0" className="utv-breadcrumb-link" onClick={() => this.props.changeGallery(undefined)}>Galleries</a>
          <i className="utv-breadcrumb-divider fas fa-chevron-right"></i>
          <a tabIndex="0" className="utv-breadcrumb-link" onClick={() => this.props.changeAlbum(undefined)}>Master</a>
          <i className="utv-breadcrumb-divider fas fa-chevron-right"></i>
          <span className="utv-breadcrumb-static">Disney</span>
        </div>
        <VideoTable
          selectedGallery={this.props.selectedGallery}
          selectedAlbum={this.props.selectedAlbum}
        />
      </div>
    );
  }
}

export default VideoTabView;
