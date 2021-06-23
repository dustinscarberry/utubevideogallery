import React from 'react';
import axios from 'axios';
import { getFormattedDate } from 'helpers/datetime-helpers';

import GriddleDND from 'component/shared/GriddleDND';
import TableRowActions from 'component/shared/TableRowActions';
import BasicLink from 'component/shared/BasicLink';

class PlaylistTable extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      rand: undefined
    };
  }

  getHeaders = () => {
    return [{
      key: 'title',
      title: 'Title',
      sortable: true,
      sortDirection: '',
      primary: true,
      formatter: (row, cellData) => {
        return <>
          <BasicLink
            onClick={() => this.props.changeView('editPlaylist', row.id)}
            classes={['utv-row-title']}
            text={cellData}
          />
          <TableRowActions
            actions={[
              {text: 'Edit / Sync', onClick: () => this.props.changeView('editPlaylist', row.id)},
              {text: 'View', link: 'https://www.youtube.com/playlist?list=' + row.sourceID},
              {text: 'Delete', onClick: () => this.deletePlaylistPrompt(row.id)}
            ]}
          />
        </>
      }
    }, {
      key: 'source',
      title: 'Source',
      sortable: true,
      sortDirection: '',
      formatter: (row, cellData) => {
        if (cellData == 'youtube')
          return 'YouTube';
        else if (cellData == 'vimeo')
          return 'Vimeo';
      }
    }, {
      key: 'album',
      title: 'Album',
      sortable: true,
      sortDirection: ''
    }, {
      key: 'dateUpdated',
      title: 'Date Updated',
      sortable: true,
      sortDirection: '',
      formatter: (row, cellData) => getFormattedDate(cellData)
    }];
  }

  getDataMapping = (data) => {
    return data.map(item => {
      return {
        id: item.id,
        title: item.title,
        source: item.source,
        sourceID: item.sourceID,
        album: item.albumName,
        dateUpdated: item.updateDate
      };
    });
  }

  getBulkActions = () => {
    return {
      options: [{
        name: 'Delete',
        value: 'delete'
      }],
      callback: (key, items) => {
        if (key == 'delete')
          this.deletePlaylistsPrompt(items);
      }
    };
  }

  deletePlaylistsPrompt = (items) => {
    if (confirm('Are you sure you want to delete these playlists?')) {
      for (const item of items)
        this.deletePlaylist(item.id);
    }
  }

  deletePlaylistPrompt = (playlistID) => {
    if (confirm('Are you sure you want to delete this playlist?'))
      this.deletePlaylist(playlistID);
  }

  deletePlaylist = async (playlistID) => {
    const rsp = await axios.delete('/wp-json/utubevideogallery/v1/playlists/' + playlistID, {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    });

    this.setState({rand: Math.random()});
  }

  render() {
    return <GriddleDND
      headers={this.getHeaders()}
      recordLabel="playlists"
      apiLoadPath={`/wp-json/utubevideogallery/v1/playlists?${rand}`}
      dataMapper={this.getDataMapping}
      enableBulkActions={true}
      bulkActionsData={this.getBulkActions()}
      enableDragNDrop={false}
    />
  }
}

export default PlaylistTable;
