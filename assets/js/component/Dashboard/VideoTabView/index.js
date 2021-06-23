import React from 'react';

import ActionBar from 'component/shared/ActionBar';
import Breadcrumbs from 'component/shared/Breadcrumbs';
import SecondaryButton from 'component/shared/SecondaryButton';
import VideoTable from './VideoTable';

const VideoTabView = ({
  changeGallery,
  changeAlbum,
  selectedGalleryTitle,
  selectedAlbumTitle,
  selectedGallery,
  selectedAlbum,
  changeView
}) => {
  return <>
    <ActionBar>
      <SecondaryButton
        title={utvJSData.localization.addVideo}
        onClick={() => changeView('addVideo')}
      />
    </ActionBar>
    <Breadcrumbs
      crumbs={[
        {text: utvJSData.localization.galleries, onClick: () => changeGallery()},
        {text: selectedGalleryTitle, onClick: () => changeAlbum()},
        {text: selectedAlbumTitle}
      ]}
    />
    <VideoTable
      selectedGallery={selectedGallery}
      selectedAlbum={selectedAlbum}
      changeView={changeView}
    />
  </>
}

export default VideoTabView;
