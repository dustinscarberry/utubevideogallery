import React from 'react';
import GalleryTable from './GalleryTable';
import ActionBar from '../shared/ActionBar';
import Breadcrumbs from '../shared/Breadcrumbs';
import SecondaryButton from '../shared/SecondaryButton';

const GalleryTabView = (props) =>
{
  return (
    <div>
      <ActionBar>
        <SecondaryButton
          title={utvJSData.localization.addGallery}
          onClick={() => props.changeView('addGallery')}
        />
      </ActionBar>
      <Breadcrumbs
        crumbs={[
          {text: utvJSData.localization.galleries}
        ]}
      />
      <GalleryTable
        changeGallery={props.changeGallery}
        changeView={props.changeView}
      />
    </div>
  );
}

export default GalleryTabView;
