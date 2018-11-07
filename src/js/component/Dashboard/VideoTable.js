import React from 'react';
import GriddleDND from '../shared/GriddleDND';
import TableRowActions from '../shared/TableRowActions';
import axios from 'axios';

class VideoTable extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      rand: undefined
    };

    this.togglePublishStatus = this.togglePublishStatus.bind(this);
    this.deleteVideo = this.deleteVideo.bind(this);
    this.deleteVideos = this.deleteVideos.bind(this);
    this.publishVideos = this.publishVideos.bind(this);
    this.unpublishVideos = this.unpublishVideos.bind(this);
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
            onClick={() => this.props.changeView('editVideo', row.id)}
            src={cellData}
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
              <span className="utv-row-title">{cellData}</span>
              <TableRowActions
                actions={[
                  {text: 'Edit', onClick: () => this.props.changeView('editVideo', row.id)},
                  {text: 'Watch', link: 'https://youtu.be/' + row.url},
                  {text: 'Delete', onClick: () => this.deleteVideo([row.id])}
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
          this.deleteVideos(items);
        else if (key == 'publish')
          this.publishVideos(items);
        else if (key == 'unpublish')
          this.unpublishVideos(items);
      }
    };
  }

  deleteVideos(items)
  {
    for (let item of items)
      this.deleteVideo(item.id);
  }

  publishVideos()
  {

  }

  unpublishVideos()
  {

  }

  getDataMapping(data)
  {
    let newData = [];

    for (let item of data)
    {
      let record = {};
      record.id = item.id;
      record.thumbnail = item.thumbnail;
      record.title = item.title;
      record.url = item.url;
      record.published = item.published;
      record.dateAdded = item.updateDate;
      newData.push(record);
    }

    return newData;
  }

  async togglePublishStatus(videoID, changeTo)
  {

  }

  

  async deleteVideo(videoID)
  {
    if (confirm('Are you sure you want to delete this?'))
    {
      //fire ajax request
      const rsp = await axios.delete(
        '/wp-json/utubevideogallery/v1/videos/' + videoID,
        {
          headers: {'X-WP-Nonce': utvJSData.restNonce}
        }
      );

      if (rsp.status == 200)
        this.setState({rand: Math.random()});
    }
  }

  render()
  {
    return <GriddleDND
      headers={this.getHeaders()}
      recordLabel="videos"
      apiLoadPath={'/wp-json/utubevideogallery/v1/albums/' + this.props.selectedAlbum + '/videos?' + this.state.rand}
      dataMapper={this.getDataMapping}
      bulkActionsData={this.getBulkActions()}
    />
  }
}

export default VideoTable;
