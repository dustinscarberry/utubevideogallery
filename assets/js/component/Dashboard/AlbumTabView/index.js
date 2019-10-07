import React from 'react';
import AlbumTable from './AlbumTable';
import ActionBar from '../../shared/ActionBar';
import Breadcrumbs from '../../shared/Breadcrumbs';
import SecondaryButton from '../../shared/SecondaryButton';

const AlbumTabView = (props) =>
{
  return (
    <div>
      <ActionBar>
        <SecondaryButton
          title={utvJSData.localization.addAlbum}
          onClick={() => props.changeView('addAlbum')}
        />
      </ActionBar>
      <Breadcrumbs
        crumbs={[
          {text: utvJSData.localization.galleries, onClick: () => props.changeGallery()},
          {text: props.selectedGalleryTitle}
        ]}
      />
      <AlbumTable
        changeAlbum={props.changeAlbum}
        changeView={props.changeView}
        selectedGallery={props.selectedGallery}
      />
    </div>
  );
}

export default AlbumTabView;
