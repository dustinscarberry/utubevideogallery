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
          <button className="button-secondary" onClick={() => this.props.changeView('addAlbum')}>{utvJSData.localization.addAlbum}</button>
        </div>
        <Breadcrumbs
          crumbs={[
            {text: utvJSData.localization.galleries, onClick: () => this.props.changeGallery()},
            {text: this.props.selectedGalleryTitle}
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
