import React from 'react';
import AlbumTable from './AlbumTable';
import Breadcrumbs from '../shared/Breadcrumbs';

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
        <Breadcrumbs
          crumbs={[
            {text: 'Galleries', onClick: () => this.props.changeGallery(undefined)},
            {text: 'Gallery Name'}
          ]}
        />
        <AlbumTable
          changeAlbum={this.props.changeAlbum}
          changeView={this.props.changeView}
          selectedGallery={this.props.selectedGallery}
        />
      </div>
    );
  }
}

export default AlbumTabView;
