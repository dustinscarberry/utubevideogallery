import React from 'react';
import GalleryTable from './GalleryTable';
import Breadcrumbs from '../shared/Breadcrumbs';
import Button from '../shared/Button';

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
          <Button
            classes={['button-secondary']}
            title={utvJSData.localization.addGallery}
            onClick={() => this.props.changeView('addGallery')}
           />
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
