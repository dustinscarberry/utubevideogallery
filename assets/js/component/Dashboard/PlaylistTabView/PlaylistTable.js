import React from 'react';
import GriddleDND from '../../shared/GriddleDND';
import TableRowActions from '../../shared/TableRowActions';
import BasicLink from '../../shared/BasicLink';
import sharedService from '../../../service/SharedService';
import axios from 'axios';

class PlaylistTable extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      rand: undefined
    };
  }

  getHeaders()
  {
    return [
      {
        key: 'title',
        title: 'Title',
        sortable: true,
        sortDirection: '',
        primary: true,
        formatter: (row, cellData) =>
        {
          return (
            <div>
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
            </div>
          );
        }
      },
      {
        key: 'source',
        title: 'Source',
        sortable: true,
        sortDirection: '',
        formatter: (row, cellData) =>
        {
          if (cellData == 'youtube')
            return 'YouTube';
          else if (cellData == 'vimeo')
            return 'Vimeo';
        }
      },
      {
        key: 'album',
        title: 'Album',
        sortable: true,
        sortDirection: ''
      },
      {
        key: 'dateUpdated',
        title: 'Date Updated',
        sortable: true,
        sortDirection: '',
        formatter: (row, cellData) =>
        {
          return sharedService.getFormattedDate(cellData);
        }
      }
    ];
  }

  getDataMapping(data)
  {
    let mappedData = [];

    for (let item of data) {
      let record = {};
      record.id = item.id;
      record.title = item.title;
      record.source = item.source;
      record.sourceID = item.sourceID;
      record.album = item.albumName;
      record.dateUpdated = item.updateDate;
      mappedData.push(record);
    }

    return mappedData;
  }

  getBulkActions()
  {
    return {
      options: [{
        name: 'Delete',
        value: 'delete'
      }],
      callback: (key, items) =>
      {
        if (key == 'delete')
          this.deletePlaylistsPrompt(items);
      }
    };
  }

  deletePlaylistsPrompt = (items) =>
  {
    if (confirm('Are you sure you want to delete these playlists?'))
    {
      for (let item of items)
        this.deletePlaylist(item.id);
    }
  }

  deletePlaylistPrompt = (playlistID) =>
  {
    if (confirm('Are you sure you want to delete this playlist?'))
      this.deletePlaylist(playlistID);
  }

  deletePlaylist = async(playlistID) =>
  {
    const rsp = await axios.delete(
      '/wp-json/utubevideogallery/v1/playlists/' + playlistID,
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (rsp.status == 200 && !rsp.data.error)
      this.setState({rand: Math.random()});
  }

  render()
  {
    return <GriddleDND
      headers={this.getHeaders()}
      recordLabel="playlists"
      apiLoadPath={
        '/wp-json/utubevideogallery/v1/playlists?'
        + this.state.rand
      }
      dataMapper={this.getDataMapping}
      enableBulkActions={true}
      bulkActionsData={this.getBulkActions()}
      enableDragNDrop={false}
    />
  }
}

export default PlaylistTable;
