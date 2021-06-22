import React from 'react';
import GriddleDND from 'component/shared/GriddleDND';
import TableRowActions from 'component/shared/TableRowActions';
import BasicLink from 'component/shared/BasicLink';
import { getFormattedDate } from 'helpers/datetime-helpers';
import axios from 'axios';

class GalleryTable extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      rand: Math.random()
    };
  }

  getHeaders = () => {
    return [{
      key: 'title',
      title: utvJSData.localization.title,
      sortable: true,
      sortDirection: '',
      primary: true,
      formatter: (row, cellData) => {
        return <>
          <BasicLink
            onClick={() => this.props.changeGallery(row.id, cellData)}
            classes={['utv-row-title']}
            text={cellData}
          />
          <TableRowActions
            actions={[{
              text: utvJSData.localization.edit,
              onClick: () => this.props.changeView('editGallery', row.id)
            }, {
              text: utvJSData.localization.view,
              onClick: () => this.props.changeGallery(row.id, cellData)
            }, {
              text: utvJSData.localization.delete,
              onClick: () => this.deleteGalleryPrompt(row.id)
            }]}
          />
        </>
      }
    }, {
      key: 'shortcode',
      title: utvJSData.localization.shortcode,
      sortable: true,
      sortDirection: ''
    }, {
      key: 'dateAdded',
      title: utvJSData.localization.dateAdded,
      sortable: true,
      sortDirection: '',
      formatter: (row, cellData) => getFormattedDate(cellData)
    }, {
      key: 'albumCount',
      title: utvJSData.localization.numberOfAlbums,
      sortable: true,
      sortDirection: ''
    }];
  }

  getDataMapping = (data) => {
    return data.map(item => {
      return {
        id: item.id,
        title: item.title,
        shortcode: '[utubevideo id="' + item.id + '"]',
        dateAdded: item.updateDate,
        albumCount: item.albumCount
      };
    });
  }

  getBulkActions = () => {
    return {
      options: [{
        name: utvJSData.localization.delete,
        value: 'delete'
      }],
      callback: (key, items) => {
        if (key == 'delete')
          this.deleteGalleriesPrompt(items);
      }
    };
  }

  deleteGalleriesPrompt = (items) => {
    if (confirm(utvJSData.localization.confirmGalleriesDelete)) {
      for (const item of items)
        this.deleteGallery(item.id);
    }
  }

  deleteGalleryPrompt = (galleryID) => {
    if (confirm(utvJSData.localization.confirmGalleryDelete))
      this.deleteGallery(galleryID);
  }

  deleteGallery = async (galleryID) => {
    await axios.delete('/wp-json/utubevideogallery/v1/galleries/' + galleryID, {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    });

    this.setState({rand: Math.random()});
  }

  render() {
    const { rand } = this.state;

    return <GriddleDND
      headers={this.getHeaders()}
      recordLabel={utvJSData.localization.galleries}
      apiLoadPath={`/wp-json/utubevideogallery/v1/galleries?${rand}`}
      dataMapper={this.getDataMapping}
      enableBulkActions={true}
      bulkActionsData={this.getBulkActions()}
      enableDragNDrop={false}
    />
  }
}

export default GalleryTable;
