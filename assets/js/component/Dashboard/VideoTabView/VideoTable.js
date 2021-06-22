import React from 'react';
import axios from 'axios';
import GriddleDND from 'component/shared/GriddleDND';
import TableRowActions from 'component/shared/TableRowActions';
import PublishedIcon from 'component/shared/PublishedIcon';
import { getFormattedDate } from 'helpers/datetime-helpers';

class VideoTable extends React.Component
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
          onClick={() => this.props.changeView('editVideo', row.id)}
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
        const watchLink = row.source == 'youtube' ? 'https://youtu.be/' + row.sourceID : 'https://vimeo.com/' + row.sourceID;

        return <div>
          <span className="utv-row-title">{cellData}</span>
          <TableRowActions
            actions={[
              {text: utvJSData.localization.edit, onClick: () => this.props.changeView('editVideo', row.id)},
              {text: utvJSData.localization.watch, link: watchLink},
              {text: utvJSData.localization.delete, onClick: () => this.deleteVideoPrompt([row.id])}
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
        return <PublishedIcon
          isPublished={!!parseInt(cellData)}
          togglePublishStatus={() => this.togglePublishStatus(row.id, (parseInt(cellData) ? 0 : 1))}
        />
      }
    }, {
      key: 'updateDate',
      title: utvJSData.localization.lastUpdated,
      sortable: true,
      sortDirection: '',
      formatter: (row, cellData) => getFormattedDate(cellData)
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
          this.deleteVideosPrompt(items);
        else if (key == 'publish')
          this.publishVideos(items);
        else if (key == 'unpublish')
          this.unpublishVideos(items);
      }
    };
  }

  deleteVideosPrompt = (items) => {
    if (confirm(utvJSData.localization.confirmVideosDelete)) {
      for (const item of items)
        this.deleteVideo(item.id);
    }
  }

  publishVideos = (items) => {
    for (const item of items)
      this.togglePublishStatus(item.id, 1);
  }

  unpublishVideos = (items) => {
    for (const item of items)
      this.togglePublishStatus(item.id, 0);
  }

  getDataMapping = (data) => {
    return data.map(item => {
      return {
        id: item.id,
        thumbnail: item.thumbnail,
        title: item.title,
        source: item.source,
        sourceID: item.sourceID,
        published: item.published,
        updateDate: item.updateDate
      };
    });
  }

  togglePublishStatus = async (videoID, publishStatus) => {
    await axios.patch('/wp-json/utubevideogallery/v1/videos/' + videoID, {
      published: publishStatus,
      skipThumbnailRender: true
    }, {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    });

    this.setState({rand: Math.random()});
  }

  deleteVideoPrompt = (videoID) => {
    if (confirm(utvJSData.localization.confirmVideoDelete))
      this.deleteVideo(videoID);
  }

  deleteVideo = async (videoID) => {
    await axios.delete('/wp-json/utubevideogallery/v1/videos/' + videoID, {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    });

    this.setState({rand: Math.random()});
  }

  reorderRows = async (tableData) => {
    if (!tableData) return;

    const videoIDs = tableData.map(item => item.id);

    // keep await to prevent out of order updates from happening (maybe)
    await axios.patch('/wp-json/utubevideogallery/v1/videosorder', {
      videoids: videoIDs
    }, {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    });
  }

  render() {
    const { selectedAlbum } = this.props;

    return <GriddleDND
      headers={this.getHeaders()}
      recordLabel={utvJSData.localization.videos}
      apiLoadPath={`/wp-json/utubevideogallery/v1/albums/${selectedAlbum}/videos?${Math.random()}`}
      dataMapper={this.getDataMapping}
      enableBulkActions={true}
      bulkActionsData={this.getBulkActions()}
      reorderRows={this.reorderRows}
    />
  }
}

export default VideoTable;
