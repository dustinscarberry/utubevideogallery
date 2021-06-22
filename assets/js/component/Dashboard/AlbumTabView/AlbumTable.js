import React from 'react';
import axios from 'axios';
import GriddleDND from 'component/shared/GriddleDND';
import TableRowActions from 'component/shared/TableRowActions';
import { getFormattedDate } from 'helpers/datetime-helpers';

class AlbumTable extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      rand: Math.random()
    };
  }

  getHeaders = () => {
    return [{
      key: 'thumbnail',
      title: utvJSData.localization.thumbnail,
      sortable: false,
      sortDirection: '',
      width: '150px',
      primary: true,
      formatter: (row, cellData) => {
        return <img
          onClick={() => this.props.changeAlbum(row.id, row.title)}
          src={utvJSData.thumbnailCacheDirectory + cellData + '.jpg'}
          className="utv-preview-thumbnail utv-is-clickable"
        />
      }
    }, {
      key: 'title',
      title: utvJSData.localization.title,
      sortable: true,
      sortDirection: '',
      formatter: (row, cellData) => {
        return <div>
          <a
            onClick={() => this.props.changeAlbum(row.id, cellData)}
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
      }
    }, {
      key: 'published',
      title: utvJSData.localization.published,
      sortable: true,
      sortDirection: '',
      formatter: (row, cellData) => {
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
    }, {
      key: 'updateDate',
      title: utvJSData.localization.lastUpdated,
      sortable: true,
      sortDirection: '',
      formatter: (row, cellData) => getFormattedDate(cellData)
    }, {
      key: 'videoCount',
      title: utvJSData.localization.numberOfVideos,
      sortable: true,
      sortDirection: ''
    }];
  }

  getBulkActions = () => {
    return {
      options: [{
        name: utvJSData.localization.delete,
        value: 'delete'
      }, {
        name: utvJSData.localization.publish,
        value: 'publish'
      }, {
        name: utvJSData.localization.unPublish,
        value: 'unpublish'
      }],
      callback: (key, items) => {
        if (key == 'delete')
          this.deleteAlbumsPrompt(items);
        else if (key == 'publish')
          this.publishAlbums(items);
        else if (key == 'unpublish')
          this.unpublishAlbums(items);
      }
    };
  }

  getDataMapping = (data) => {
    return data.map(item => {
      return {
        id: item.id,
        thumbnail: item.thumbnail,
        title: item.title,
        published: item.published,
        updateDate: item.updateDate,
        videoCount: item.videoCount
      };
    });
  }

  deleteAlbumsPrompt = (items) => {
    if (confirm(utvJSData.localization.confirmAlbumsDelete)) {
      for (const item of items)
        this.deleteAlbum(item.id);
    }
  }

  publishAlbums = (items) => {
    for (const item of items)
      this.togglePublishStatus(item.id, 1);
  }

  unpublishAlbums = (items) => {
    for (const item of items)
      this.togglePublishStatus(item.id, 0);
  }

  deleteAlbumPrompt = (albumID) => {
    if (confirm(utvJSData.localization.confirmAlbumDelete))
      this.deleteAlbum(albumID);
  }

  togglePublishStatus = async (albumID, changeTo) => {
    await axios.patch('/wp-json/utubevideogallery/v1/albums/' + albumID, {
      published: changeTo
    }, {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    });

    this.setState({rand: Math.random()});
  }

  deleteAlbum = async (albumID) => {
    await axios.delete('/wp-json/utubevideogallery/v1/albums/' + albumID, {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    });

    this.setState({rand: Math.random()});
  }

  reorderRows = async (tableData) => {
    if (!tableData) return;

    const albumIDs = tableData.map(item => item.id);

    await axios.patch('/wp-json/utubevideogallery/v1/albumsorder', {
      albumids: albumIDs
    }, {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    });
  }

  render() {
    const { selectedGallery } = this.props;
    const { rand } = this.state;

    return <GriddleDND
      headers={this.getHeaders()}
      recordLabel={utvJSData.localization.albums}
      apiLoadPath={`/wp-json/utubevideogallery/v1/galleries/${selectedGallery}/albums?${rand}`}
      dataMapper={this.getDataMapping}
      enableBulkActions={true}
      bulkActionsData={this.getBulkActions()}
      reorderRows={this.reorderRows}
    />
  }
}

export default AlbumTable;
