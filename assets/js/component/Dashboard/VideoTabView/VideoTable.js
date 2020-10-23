import React from 'react';
import GriddleDND from '../../shared/GriddleDND';
import TableRowActions from '../../shared/TableRowActions';
import sharedService from '../../../service/SharedService';
import axios from 'axios';

class VideoTable extends React.Component
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
        formatter: (row, cellData) => {
          return <img
            onClick={() => this.props.changeView('editVideo', row.id)}
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
        formatter: (row, cellData) => {
          const watchLink = row.source == 'youtube' ? 'https://youtu.be/' + row.sourceID : 'https://vimeo.com/' + row.sourceID;

          return (
            <div>
              <span className="utv-row-title">{cellData}</span>
              <TableRowActions
                actions={[
                  {text: utvJSData.localization.edit, onClick: () => this.props.changeView('editVideo', row.id)},
                  {text: utvJSData.localization.watch, link: watchLink},
                  {text: utvJSData.localization.delete, onClick: () => this.deleteVideoPrompt([row.id])}
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
        formatter: (row, cellData) => {
          return sharedService.getFormattedDate(cellData);
        }
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
          this.deleteVideosPrompt(items);
        else if (key == 'publish')
          this.publishVideos(items);
        else if (key == 'unpublish')
          this.unpublishVideos(items);
      }
    };
  }

  deleteVideosPrompt = (items) =>
  {
    if (confirm(utvJSData.localization.confirmVideosDelete))
    {
      for (let item of items)
        this.deleteVideo(item.id);
    }
  }

  publishVideos = (items) =>
  {
    for (let item of items)
      this.togglePublishStatus(item.id, 1);
  }

  unpublishVideos = (items) =>
  {
    for (let item of items)
      this.togglePublishStatus(item.id, 0);
  }

  getDataMapping(data)
  {
    let newData = [];

    for (let item of data) {
      let record = {};
      record.id = item.id;
      record.thumbnail = item.thumbnail;
      record.title = item.title;
      record.source = item.source;
      record.sourceID = item.sourceID;
      record.published = item.published;
      record.updateDate = item.updateDate;
      newData.push(record);
    }

    return newData;
  }

  togglePublishStatus = async(videoID, changeTo) =>
  {
    const rsp = await axios.patch(
      '/wp-json/utubevideogallery/v1/videos/'
      + videoID,
      {
        published: changeTo,
        skipThumbnailRender: true
      },
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (rsp.status == 200)
      this.setState({rand: Math.random()});
  }

  deleteVideoPrompt = (videoID) =>
  {
    if (confirm(utvJSData.localization.confirmVideoDelete))
      this.deleteVideo(videoID);
  }

  deleteVideo = async(videoID) =>
  {
    const rsp = await axios.delete(
      '/wp-json/utubevideogallery/v1/videos/' + videoID,
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

    const videoIDs = tableData.map(item => item.id);

    const rsp = await axios.patch(
      '/wp-json/utubevideogallery/v1/videosorder',
      {
        videoids: videoIDs
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
      recordLabel={utvJSData.localization.videos}
      apiLoadPath={
        '/wp-json/utubevideogallery/v1/albums/'
        + this.props.selectedAlbum
        + '/videos?'
        + this.state.rand
      }
      dataMapper={this.getDataMapping}
      enableBulkActions={true}
      bulkActionsData={this.getBulkActions()}
      reorderRows={this.reorderRows}
    />
  }
}

export default VideoTable;
