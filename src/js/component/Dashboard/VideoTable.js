import React from 'react';
import Griddle from '../shared/griddle/Griddle';
import axios from 'axios';

class VideoTable extends React.Component
{
  constructor(props)
  {
    super(props);

    this.togglePublishStatus = this.togglePublishStatus.bind(this);
  }

  getHeaders()
  {
    return [
      {
        key: 'id',
        title: 'ID',
        sortable: true,
        sortDirection: 'desc',
        width: '60px'
      },
      {
        key: 'thumbnail',
        title: 'Thumbnail',
        sortable: false,
        sortDirection: '',
        width: '150px',
        formatter: (row, cellData) =>
        {
          return <img
            src={cellData}
            className="utv-preview-thumb"
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
          return <span className="utv-row-title">{cellData}</span>;
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
              onClick={this.togglePublishStatus(row.id, 0)}
              className="utv-published-icon far fa-check-circle"
            ></i>
          else
            return <i
              onClick={this.togglePublishStatus(row.id, 1)}
              className="utv-unpublished-icon far fa-times-circle"
            ></i>
        }
      },
      {
        key: 'dateAdded',
        title: 'Date Added',
        sortable: true,
        sortDirection: ''
      }
    ];
  }

  getDataMapping(data)
  {
    let newData = [];

    for (let item of data)
    {
      let record = {};
      let dateAdded = new Date(item.updateDate * 1000);
      record.id =  item.id;
      record.thumbnail = item.thumbnail;
      record.title = item.title;
      record.published = item.published;
      record.dateAdded = dateAdded.getFullYear() + '/' + (dateAdded.getMonth() + 1) + '/' + dateAdded.getDate();
      newData.push(record);
    }

    return newData;
  }

  async togglePublishStatus(videoID, changeTo)
  {
    let rsp = await axios.get('/wp-json/utubevideogallery/v1/');

    /*


    create gallery
    create album
    create video
    create playlist

    edit gallery
    edit album
    edit video
    edit playlist

    delete gallery
    delete album
    delete video
    delete playlist




    */

    if (apiData.status == 200)
    {

    }
  }

  render()
  {
    return <Griddle
      headers={this.getHeaders()}
      recordLabel="videos"
      apiLoadPath={'/wp-json/utubevideogallery/v1/galleries/' + this.props.selectedGallery + '/albums/' + this.props.selectedAlbum + '/videos'}
      dataMapper={this.getDataMapping}
    />
  }
}

export default VideoTable;
