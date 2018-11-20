import React from 'react';
import GriddleDND from '../shared/GriddleDND';
import TableRowActions from '../shared/TableRowActions';
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
        formatter: (row, cellData) =>
        {
          return (
            <div>
              <a
                onClick={() => this.props.changeView('editPlaylist', row.id)}
                href="javascript:void(0)"
                className="utv-row-title">
                  {cellData}
              </a>
              <TableRowActions
                actions={[
                  {text: 'Edit / Sync', onClick: () => this.props.changeView('editPlaylist', row.id)},
                  {text: 'View', onClick: () => window.location = 'https://www.youtube.com/playlist?list=' + row.sourceID},
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
          const dateAdded = new Date(cellData * 1000);

          return dateAdded.getFullYear()
            + '/' + (dateAdded.getMonth() + 1)
            + '/' + dateAdded.getDate();
        }
      }
    ];
  }

  getDataMapping(data)
  {
    let mappedData = [];

    for (let item of data)
    {
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
      options: [
        {
          name: 'Delete',
          value: 'delete'
        }
      ],
      callback: (key, items) =>
      {
        if (key == 'delete')
          this.deletePlaylistsPrompt(items);
      }
    };
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
