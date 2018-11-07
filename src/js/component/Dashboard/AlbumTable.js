import React from 'react';
import GriddleDND from '../shared/GriddleDND';
import TableRowActions from '../shared/TableRowActions';

class AlbumTable extends React.Component
{
  constructor(props)
  {
    super(props);

    this.togglePublishStatus = this.togglePublishStatus.bind(this);
    this.deleteAlbum = this.deleteAlbum.bind(this);
  }

  getHeaders()
  {
    return [
      {
        key: 'id',
        title: 'ID',
        sortable: true,
        sortDirection: 'desc',
        width: '75px'
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
            onClick={() => this.props.changeAlbum(row.id)}
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
              <a
                onClick={() => this.props.changeAlbum(row.id)}
                href="javascript:void(0)"
                className="utv-row-title">
                  {cellData}
              </a>
              <TableRowActions
                actions={[
                  {text: 'Edit', onClick: () => this.props.changeView('editAlbum', row.id)},
                  {text: 'View', onClick: () => this.props.changeAlbum(row.id)},
                  {text: 'Delete', onClick: () => this.deleteAlbum(row.id)}
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
              className="utv-published-icon far fa-check-circle"
            ></i>
          else
            return <i
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

  async togglePublishStatus(videoID, changeTo)
  {

  }

  async deleteAlbum(albumID)
  {
    if (confirm('Are you sure you want to delete this?'))
    {
      //fire ajax request



    }
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

  render()
  {
    return <GriddleDND
      headers={this.getHeaders()}
      recordLabel="albums"
      apiLoadPath={'/wp-json/utubevideogallery/v1/galleries/' + this.props.selectedGallery + '/albums'}
      dataMapper={this.getDataMapping}
    />
  }
}

export default AlbumTable;
