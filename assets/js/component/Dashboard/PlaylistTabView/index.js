import React from 'react';

import VideoTable from './PlaylistTable';
import ActionBar from 'component/shared/ActionBar';
import Breadcrumbs from 'component/shared/Breadcrumbs';
import SecondaryButton from 'component/shared/SecondaryButton';
import PlaylistTable from './PlaylistTable';

const PlaylistTabView = ({changeView}) => {
  return <>
    <ActionBar>
      <SecondaryButton
        title={utvJSData.localization.addPlaylist}
        onClick={() => changeView('addPlaylist')}
      />
    </ActionBar>
    <Breadcrumbs
      crumbs={[
        {text: utvJSData.localization.savedPlaylists}
      ]}
    />
    <PlaylistTable
      changeView={changeView}
    />
  </>
}

export default PlaylistTabView;
