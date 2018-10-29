import React from 'react';
import Griddle from '../shared/Griddle';
import TableRowActions from '../shared/TableRowActions';
import axios from 'axios';

class VideoTable extends React.Component
{
  constructor(props)
  {
    super(props);

    this.togglePublishStatus = this.togglePublishStatus.bind(this);
    this.deleteVideo = this.deleteVideo.bind(this);
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
        key: 'titleActions',
        title: 'Title',
        sortable: true,
        sortDirection: '',
        formatter: (row, cellData) =>
        {
          return (
            <div>
              <span className="utv-row-title">{cellData.title}</span>
              <TableRowActions
                actions={[
                  {text: 'Edit', onClick: () => this.props.changeView('editVideo', row.id)},
                  {text: 'Watch', link: 'https://youtu.be/' + cellData.url},
                  {text: 'Delete', onClick: () => this.deleteVideo(row.id)}
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
          this.deleteItems(items);
        else if (key == 'publish')
          this.publishItems(items);
        else if (key == 'unpublish')
          this.unpublishItems(items);
      }
    };
  }

  deleteItems()
  {

  }

  publishItems()
  {

  }

  unpublishItems()
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
      record.titleActions = {title: item.title, url: item.url};
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



    }
  }

  render()
  {
    return <Griddle
      headers={this.getHeaders()}
      key="id"//this is the key value from the mapped data to use for row ids, bulk actions / reordering, defaults to id
      recordLabel="videos"
      apiLoadPath={'/wp-json/utubevideogallery/v1/albums/' + this.props.selectedAlbum + '/videos'}
      dataMapper={this.getDataMapping}
      bulkActionsData={this.getBulkActions()}
    />
  }
}

export default VideoTable;
