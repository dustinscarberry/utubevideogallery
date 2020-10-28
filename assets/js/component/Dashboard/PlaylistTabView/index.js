import React from 'react';
import VideoTable from './PlaylistTable';
import ActionBar from 'component/shared/ActionBar';
import Breadcrumbs from 'component/shared/Breadcrumbs';
import SecondaryButton from 'component/shared/SecondaryButton';
import PlaylistTable from './PlaylistTable';

const PlaylistTabView = (props) =>
{
  return (
    <div>
      <ActionBar>
        <SecondaryButton
          title={utvJSData.localization.addPlaylist}
          onClick={() => props.changeView('addPlaylist')}
        />
      </ActionBar>
      <Breadcrumbs
        crumbs={[
          {text: utvJSData.localization.savedPlaylists}
        ]}
      />
      <PlaylistTable
        changeView={props.changeView}
      />
    </div>
  );
}

export default PlaylistTabView;
