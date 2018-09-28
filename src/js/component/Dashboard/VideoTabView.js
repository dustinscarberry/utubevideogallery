import React from 'react';
import VideoTable from './VideoTable';
import Breadcrumbs from '../shared/Breadcrumbs';

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
        <Breadcrumbs
          crumbs={[
            {text: 'Galleries', onClick: () => this.props.changeGallery(undefined)},
            {text: 'Master', onClick: () => this.props.changeAlbum(undefined)},
            {text: 'Disney'}
          ]}
        />
        <VideoTable
          selectedGallery={this.props.selectedGallery}
          selectedAlbum={this.props.selectedAlbum}
          changeView={this.props.changeView}
        />
      </div>
    );
  }
}

export default VideoTabView;
