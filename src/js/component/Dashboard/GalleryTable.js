import React from 'react';
import Griddle from '../shared/Griddle';
import TableRowActions from '../shared/TableRowActions';

class GalleryTable extends React.Component
{
  constructor(props)
  {
    super(props);

    this.deleteGallery = this.deleteGallery.bind(this);
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
        key: 'titleActions',
        title: 'Title',
        sortable: true,
        sortDirection: '',
        formatter: (row, cellData) =>
        {
          return (
            <div>
              <a
                onClick={() => this.props.changeGallery(row.id)}
                href="javascript:void(0)"
                className="utv-row-title">
                  {cellData.title}
              </a>
              <TableRowActions
                actions={[
                  {text: 'Edit', onClick: () => this.props.changeView('editGallery', row.id)},
                  {text: 'View', onClick: () => this.props.changeGallery(row.id)},
                  {text: 'Delete', onClick: () => this.deleteGallery(row.id)}
                ]}
              />
            </div>
          );
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
        key: 'albumCount',
        title: '# Albums',
        sortable: true,
        sortDirection: ''
      }
    ];
  }

  async deleteGallery(galleryID)
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
      record.id = item.id;
      record.titleActions = {title: item.title};
      record.shortcode = '[utubevideo id="' + item.id + '"]';
      record.dateAdded = item.updateDate;
      record.albumCount = item.albumCount;
      newData.push(record);
    }

    return newData;
  }

  render()
  {
    return <Griddle
      headers={this.getHeaders()}
      recordLabel="galleries"
      apiLoadPath="/wp-json/utubevideogallery/v1/galleries"
      dataMapper={this.getDataMapping}
    />
  }
}

export default GalleryTable;
