import React from 'react';

import GalleryTable from './GalleryTable';
import ActionBar from 'component/shared/ActionBar';
import Breadcrumbs from 'component/shared/Breadcrumbs';
import SecondaryButton from 'component/shared/SecondaryButton';

const GalleryTabView = ({changeView, changeGallery}) => {
  return <>
    <ActionBar>
      <SecondaryButton
        title={utvJSData.localization.addGallery}
        onClick={() => changeView('addGallery')}
      />
    </ActionBar>
    <Breadcrumbs
      crumbs={[
        {text: utvJSData.localization.galleries}
      ]}
    />
    <GalleryTable
      changeGallery={changeGallery}
      changeView={changeView}
    />
  </>
}

export default GalleryTabView;
