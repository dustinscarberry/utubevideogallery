import React from 'react';
import GalleryTable from './GalleryTable';

class GalleryTabView extends React.Component
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
          <button className="utv-link-submit-button" onClick={() => this.props.changeView('addGallery')}>Add Gallery</button>
        </div>
        <div className="utv-breadcrumbs">
          <span className="utv-breadcrumb-static">Galleries</span>
        </div>
        <GalleryTable
          changeGallery={this.props.changeGallery}
        />
      </div>
    );
  }
}

export default GalleryTabView;
