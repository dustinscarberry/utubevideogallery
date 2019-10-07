import React from 'react';
import GriddleDND from '../../shared/GriddleDND';
import TableRowActions from '../../shared/TableRowActions';
import sharedService from '../../../service/SharedService';
import axios from 'axios';

class AlbumTable extends React.Component
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
        key: 'thumbnail',
        title: utvJSData.localization.thumbnail,
        sortable: false,
        sortDirection: '',
        width: '150px',
        primary: true,
        formatter: (row, cellData) =>
        {
          return <img
            onClick={() => this.props.changeAlbum(row.id, row.title)}
            src={utvJSData.thumbnailCacheDirectory + cellData + '.jpg'}
            className="utv-preview-thumbnail utv-is-clickable"
          />
        }
      },
      {
        key: 'title',
        title: utvJSData.localization.title,
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
                  {text: utvJSData.localization.edit, onClick: () => this.props.changeView('editAlbum', row.id)},
                  {text: utvJSData.localization.view, onClick: () => this.props.changeAlbum(row.id, cellData)},
                  {text: utvJSData.localization.delete, onClick: () => this.deleteAlbumPrompt(row.id)}
                ]}
              />
            </div>
          );
        }
      },
      {
        key: 'published',
        title: utvJSData.localization.published,
        sortable: true,
        sortDirection: '',
        formatter: (row, cellData) =>
        {
          if (cellData == 1)
            return <i
              onClick={() => this.togglePublishStatus(row.id, 0)}
              className="utv-published-icon utv-is-clickable far fa-check-circle"
            ></i>
          else
            return <i
              onClick={() => this.togglePublishStatus(row.id, 1)}
              className="utv-unpublished-icon utv-is-clickable far fa-times-circle"
            ></i>
        }
      },
      {
        key: 'updateDate',
        title: utvJSData.localization.lastUpdated,
        sortable: true,
        sortDirection: '',
        formatter: (row, cellData) =>
        {
          return sharedService.getFormattedDate(cellData);
        }
      },
      {
        key: 'videoCount',
        title: utvJSData.localization.numberOfVideos,
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
          name: utvJSData.localization.delete,
          value: 'delete'
        },
        {
          name: utvJSData.localization.publish,
          value: 'publish'
        },
        {
          name: utvJSData.localization.unPublish,
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
    return data.map(item =>
    {
      let record = {};
      record.id =  item.id;
      record.thumbnail = item.thumbnail;
      record.title = item.title;
      record.published = item.published;
      record.updateDate = item.updateDate;
      record.videoCount = item.videoCount;
      return record;
    });
  }

  deleteAlbumsPrompt = (items) =>
  {
    if (confirm(utvJSData.localization.confirmAlbumsDelete))
    {
      for (let item of items)
        this.deleteAlbum(item.id);
    }
  }

  publishAlbums = (items) =>
  {
    for (let item of items)
      this.togglePublishStatus(item.id, 1);
  }

  unpublishAlbums = (items) =>
  {
    for (let item of items)
      this.togglePublishStatus(item.id, 0);
  }

  deleteAlbumPrompt = (albumID) =>
  {
    if (confirm(utvJSData.localization.confirmAlbumDelete))
      this.deleteAlbum(albumID);
  }

  togglePublishStatus = async(albumID, changeTo) =>
  {
    const rsp = await axios.patch(
      '/wp-json/utubevideogallery/v1/albums/'
      + albumID,
      { published: changeTo },
      { headers: {'X-WP-Nonce': utvJSData.restNonce} }
    );

    if (rsp.status == 200 && !rsp.data.error)
      this.setState({rand: Math.random()});
  }

  deleteAlbum = async(albumID) =>
  {
    const rsp = await axios.delete(
      '/wp-json/utubevideogallery/v1/albums/' + albumID,
      { headers: {'X-WP-Nonce': utvJSData.restNonce} }
    );

    if (rsp.status == 200 && !rsp.data.error)
      this.setState({rand: Math.random()});
  }

  async reorderRows(tableData)
  {
    if (!tableData)
      return;

    const albumIDs = tableData.map(item => item.id);

    const rsp = await axios.patch(
      '/wp-json/utubevideogallery/v1/albumsorder',
      { albumids: albumIDs },
      { headers: {'X-WP-Nonce': utvJSData.restNonce} }
    );
  }

  render()
  {
    return <GriddleDND
      headers={this.getHeaders()}
      recordLabel={utvJSData.localization.albums}
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
