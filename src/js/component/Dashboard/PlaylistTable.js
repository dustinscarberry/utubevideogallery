import React from 'react';
import Griddle from '../shared/Griddle/Griddle';

class PlaylistTable extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  getHeaders()
  {
    return [
      {
        key: 'id',
        title: 'ID',
        sortable: true,
        sortDirection: 'desc'
      },
      {
        key: 'title',
        title: 'Title',
        sortable: true,
        sortDirection: '',
        formatter: (row, cellData) =>
        {
          return <a
            onClick={() => this.props.changeGallery(row.id)}
            href="javascript:void(0)"
            className="utv-row-title">
              {cellData}
          </a>
        }
      },
      {
        key: 'shortcode',
        title: 'Shortcode',
        sortable: true,
        sortDirection: ''
      },
      {
        key: 'dateAdded',
        title: 'Date Added',
        sortable: true,
        sortDirection: ''
      },
      {
        key: 'albumCount',
        title: '# Albums',
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
      let updateDate = new Date(item.updateDate * 1000);
      record.id = item.id;
      record.title = item.title;
      record.shortcode = '[utubevideo id="' + item.id + '"]';
      record.dateAdded = updateDate.getFullYear() + '/' + (updateDate.getMonth() + 1) + '/' + updateDate.getDate();
      record.albumCount = item.albumCount;
      newData.push(record);
    }

    return newData;
  }

  render()
  {
    return <Griddle
      headers={this.getHeaders()}
      recordLabel="playlists"
      apiLoadPath="/wp-json/utubevideogallery/v1/galleries"
      dataMapper={this.getDataMapping}
    />
  }
}

export default PlaylistTable;
