import React from 'react';
import AlbumTable from './AlbumTable';

class AlbumTabView extends React.Component
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
          <button className="utv-link-submit-button" onClick={() => this.props.changeView('addAlbum')}>Add Album</button>
        </div>
        <div className="utv-breadcrumbs">
          <a className="utv-breadcrumb-link" onClick={() => this.props.changeGallery(undefined)}>Galleries</a>
          <i className="utv-breadcrumb-divider fas fa-chevron-right"></i>
          <span className="utv-breadcrumb-static">Gallery Name</span>
        </div>
        <AlbumTable
          changeAlbum={this.props.changeAlbum}
          selectedGallery={this.props.selectedGallery}
        />
      </div>
    );
  }
}

export default AlbumTabView;
