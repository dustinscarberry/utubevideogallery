import React from 'react';
import GriddleDND from '../shared/GriddleDND';
import TableRowActions from '../shared/TableRowActions';
import axios from 'axios';

class AlbumTable extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      rand: undefined
    };

    this.deleteAlbumsPrompt = this.deleteAlbumsPrompt.bind(this);
    this.deleteAlbumPrompt = this.deleteAlbumPrompt.bind(this);
    this.publishAlbums = this.publishAlbums.bind(this);
    this.unpublishAlbums = this.unpublishAlbums.bind(this);
    this.togglePublishStatus = this.togglePublishStatus.bind(this);
    this.deleteAlbum = this.deleteAlbum.bind(this);
  }

  getHeaders()
  {
    return [
      {
        key: 'thumbnail',
        title: 'Thumbnail',
        sortable: false,
        sortDirection: '',
        width: '150px',
        formatter: (row, cellData) =>
        {
          return <img
            onClick={() => this.props.changeAlbum(row.id, row.title)}
            src={utvJSData.thumbnailCacheDirectory + cellData + '.jpg'}
            className="utv-preview-thumb utv-is-clickable"
            data-rjs="2"
          />
        }
      },
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
                onClick={() => this.props.changeAlbum(row.id, cellData)}
                href="javascript:void(0)"
                className="utv-row-title">
                  {cellData}
              </a>
              <TableRowActions
                actions={[
                  {text: 'Edit', onClick: () => this.props.changeView('editAlbum', row.id)},
                  {text: 'View', onClick: () => this.props.changeAlbum(row.id, cellData)},
                  {text: 'Delete', onClick: () => this.deleteAlbumPrompt(row.id)}
                ]}
              />
            </div>
          );
        }
      },
      {
        key: 'published',
        title: 'Published',
        sortable: true,
        sortDirection: '',
        formatter: (row, cellData) =>
        {
          if (cellData == 1)
            return <i
              onClick={() => this.togglePublishStatus(row.id, 0)}
              className="utv-published-icon far fa-check-circle"
            ></i>
          else
            return <i
              onClick={() => this.togglePublishStatus(row.id, 1)}
              className="utv-unpublished-icon far fa-times-circle"
            ></i>
        }
      },
      {
        key: 'dateAdded',
        title: 'Date Added',
        sortable: true,
        sortDirection: '',
        formatter: (row, cellData) =>
        {
          let dateAdded = new Date(cellData * 1000);

          return dateAdded.getFullYear()
            + '/' + (dateAdded.getMonth() + 1)
            + '/' + dateAdded.getDate();
        }
      },
      {
        key: 'videoCount',
        title: '# Videos',
        sortable: true,
        sortDirection: ''
      }
    ];
  }

  getBulkActions()
  {
    return {
      options: [
        {
          name: 'Delete',
          value: 'delete'
        },
        {
          name: 'Publish',
          value: 'publish'
        },
        {
          name: 'Un-Publish',
          value: 'unpublish'
        }
      ],
      callback: (key, items) =>
      {
        if (key == 'delete')
          this.deleteAlbumsPrompt(items);
        else if (key == 'publish')
          this.publishAlbums(items);
        else if (key == 'unpublish')
          this.unpublishAlbums(items);
      }
    };
  }

  getDataMapping(data)
  {
    let newData = [];

    for (let item of data)
    {
      let record = {};
      record.id =  item.id;
      record.thumbnail = item.thumbnail;
      record.title = item.title;
      record.published = item.published;
      record.dateAdded = item.updateDate;
      record.videoCount = item.videoCount;
      newData.push(record);
    }

    return newData;
  }

  deleteAlbumsPrompt(items)
  {
    if (confirm('Are you sure you want to delete these albums?'))
    {
      for (let item of items)
        this.deleteAlbum(item.id);
    }
  }

  publishAlbums(items)
  {
    for (let item of items)
      this.togglePublishStatus(item.id, 1);
  }

  unpublishAlbums(items)
  {
    for (let item of items)
      this.togglePublishStatus(item.id, 0);
  }

  deleteAlbumPrompt(albumID)
  {
    if (confirm('Are you sure you want to delete this album?'))
      this.deleteAlbum(albumID);
  }

  async togglePublishStatus(albumID, changeTo)
  {
    const rsp = await axios.patch(
      '/wp-json/utubevideogallery/v1/albums/' + albumID,
      {
        published: changeTo
      },
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (rsp.status == 200)
      this.setState({rand: Math.random()});
  }

  async deleteAlbum(albumID)
  {
    const rsp = await axios.delete(
      '/wp-json/utubevideogallery/v1/albums/' + albumID,
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (rsp.status == 200)
      this.setState({rand: Math.random()});
  }

  async reorderRows(tableData)
  {
    if (!tableData)
      return;

    const albumIDs = tableData.map(item => item.id);

    const rsp = await axios.patch(
      '/wp-json/utubevideogallery/v1/albumsorder',
      {
        albumids: albumIDs
      },
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );
  }

  render()
  {
    return <GriddleDND
      headers={this.getHeaders()}
      recordLabel="albums"
      apiLoadPath={
        '/wp-json/utubevideogallery/v1/galleries/'
        + this.props.selectedGallery
        + '/albums?'
        + this.state.rand
      }
      dataMapper={this.getDataMapping}
      enableBulkActions={true}
      bulkActionsData={this.getBulkActions()}
      reorderRows={this.reorderRows}
    />
  }
}

export default AlbumTable;
