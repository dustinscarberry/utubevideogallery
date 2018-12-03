import React from 'react';
import GalleryTable from './GalleryTable';
import Breadcrumbs from '../shared/Breadcrumbs';

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
          <button className="button-secondary" onClick={() => this.props.changeView('addGallery')}>Add Gallery</button>
        </div>
        <Breadcrumbs
          crumbs={[
            {text: 'Galleries'}
          ]}
        />
        <GalleryTable
          changeGallery={this.props.changeGallery}
          changeView={this.props.changeView}
        />
      </div>
    );
  }
}

export default GalleryTabView;
