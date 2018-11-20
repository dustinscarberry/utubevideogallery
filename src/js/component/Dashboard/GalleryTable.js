import React from 'react';
import GriddleDND from '../shared/GriddleDND';
import TableRowActions from '../shared/TableRowActions';
import axios from 'axios';

class GalleryTable extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      rand: undefined
    };

    this.deleteGalleriesPrompt = this.deleteGalleriesPrompt.bind(this);
    this.deleteGalleryPrompt = this.deleteGalleryPrompt.bind(this);
    this.deleteGallery = this.deleteGallery.bind(this);
  }

  getHeaders()
  {
    return [
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
                onClick={() => this.props.changeGallery(row.id)}
                href="javascript:void(0)"
                className="utv-row-title">
                  {cellData}
              </a>
              <TableRowActions
                actions={[
                  {text: 'Edit', onClick: () => this.props.changeView('editGallery', row.id)},
                  {text: 'View', onClick: () => this.props.changeGallery(row.id)},
                  {text: 'Delete', onClick: () => this.deleteGalleryPrompt(row.id)}
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

  getDataMapping(data)
  {
    let newData = [];

    for (let item of data)
    {
      let record = {};
      record.id = item.id;
      record.title = item.title;
      record.shortcode = '[utubevideo id="' + item.id + '"]';
      record.dateAdded = item.updateDate;
      record.albumCount = item.albumCount;
      newData.push(record);
    }

    return newData;
  }

  getBulkActions()
  {
    return {
      options: [
        {
          name: 'Delete',
          value: 'delete'
        }
      ],
      callback: (key, items) =>
      {
        if (key == 'delete')
          this.deleteGalleriesPrompt(items);
      }
    };
  }

  deleteGalleriesPrompt(items)
  {
    if (confirm('Are you sure you want to delete these galleries?'))
    {
      for (let item of items)
        this.deleteGallery(item.id);
    }
  }

  deleteGalleryPrompt(galleryID)
  {
    if (confirm('Are you sure you want to delete this gallery?'))
      this.deleteGallery(galleryID);
  }

  async deleteGallery(galleryID)
  {
    const rsp = await axios.delete(
      '/wp-json/utubevideogallery/v1/galleries/' + galleryID,
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (rsp.status == 200)
      this.setState({rand: Math.random()});
  }

  render()
  {
    return <GriddleDND
      headers={this.getHeaders()}
      recordLabel="galleries"
      apiLoadPath={
        '/wp-json/utubevideogallery/v1/galleries?'
        + this.state.rand
      }
      dataMapper={this.getDataMapping}
      enableBulkActions={true}
      bulkActionsData={this.getBulkActions()}
      enableDragNDrop={false}
    />
  }
}

export default GalleryTable;
