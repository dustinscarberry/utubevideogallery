import React from 'react';
import GriddleDND from 'component/shared/GriddleDND';
import TableRowActions from 'component/shared/TableRowActions';
import BasicLink from 'component/shared/BasicLink';
import { getFormattedDate } from 'helpers/datetime-helpers';
import axios from 'axios';

class GalleryTable extends React.Component
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
        key: 'title',
        title: utvJSData.localization.title,
        sortable: true,
        sortDirection: '',
        primary: true,
        formatter: (row, cellData) =>
        {
          return (
            <div>
              <BasicLink
                onClick={() => this.props.changeGallery(row.id, cellData)}
                classes={['utv-row-title']}
                text={cellData}
              />
              <TableRowActions
                actions={[
                  {
                    text: utvJSData.localization.edit,
                    onClick: () => this.props.changeView('editGallery', row.id)
                  },
                  {
                    text: utvJSData.localization.view,
                    onClick: () => this.props.changeGallery(row.id, cellData)
                  },
                  {
                    text: utvJSData.localization.delete,
                    onClick: () => this.deleteGalleryPrompt(row.id)
                  }
                ]}
              />
            </div>
          );
        }
      },
      {
        key: 'shortcode',
        title: utvJSData.localization.shortcode,
        sortable: true,
        sortDirection: ''
      },
      {
        key: 'dateAdded',
        title: utvJSData.localization.dateAdded,
        sortable: true,
        sortDirection: '',
        formatter: (row, cellData) =>
        {
          return getFormattedDate(cellData);
        }
      },
      {
        key: 'albumCount',
        title: utvJSData.localization.numberOfAlbums,
        sortable: true,
        sortDirection: ''
      }
    ];
  }

  getDataMapping(data)
  {
    const newData = [];

    for (const item of data)
    {
      const record = {};
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
          name: utvJSData.localization.delete,
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

  deleteGalleriesPrompt = (items) =>
  {
    if (confirm(utvJSData.localization.confirmGalleriesDelete))
    {
      for (const item of items)
        this.deleteGallery(item.id);
    }
  }

  deleteGalleryPrompt = (galleryID) =>
  {
    if (confirm(utvJSData.localization.confirmGalleryDelete))
      this.deleteGallery(galleryID);
  }

  deleteGallery = async(galleryID) =>
  {
    const rsp = await axios.delete(
      '/wp-json/utubevideogallery/v1/galleries/'
      + galleryID,
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (rsp.status == 200 && !rsp.data.error)
      this.setState({rand: Math.random()});
  }

  render()
  {
    return <GriddleDND
      headers={this.getHeaders()}
      recordLabel={utvJSData.localization.galleries}
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
