import React from 'react';
import ActionBar from '../../shared/ActionBar';
import Breadcrumbs from '../../shared/Breadcrumbs';
import SecondaryButton from '../../shared/SecondaryButton';
import VideoTable from './VideoTable';

const VideoTabView = (props) =>
{
  return (
    <div>
      <ActionBar>
        <SecondaryButton
          title={utvJSData.localization.addVideo}
          onClick={() => props.changeView('addVideo')}
        />
      </ActionBar>
      <Breadcrumbs
        crumbs={[
          {text: utvJSData.localization.galleries, onClick: () => props.changeGallery()},
          {text: props.selectedGalleryTitle, onClick: () => props.changeAlbum()},
          {text: props.selectedAlbumTitle}
        ]}
      />
      <VideoTable
        selectedGallery={props.selectedGallery}
        selectedAlbum={props.selectedAlbum}
        changeView={props.changeView}
      />
    </div>
  );
}

export default VideoTabView;
