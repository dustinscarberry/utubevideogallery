import React from 'react';
import Tabs from './Tabs';
import Pane from './Pane';
import Card from './Card';
import FormField from './FormField';
import TextInput from './TextInput';
import Label from './Label';
import Columns from './Columns';
import Column from './Column';
import SectionHeader from './SectionHeader';
import Toggle from './Toggle';
import Griddle from './Griddle/Griddle';

class Dashboard extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      selectedGallery: undefined,
      selectedAlbum: undefined
    };

    this.changeGallery = this.changeGallery.bind(this);
    this.changeAlbum = this.changeAlbum.bind(this);
  }

  changeGallery(value)
  {
    this.setState({selectedGallery: value});
  }

  changeAlbum(value)
  {
    this.setState({selectedAlbum: value});
  }

  getGalleriesTable()
  {
    let galleryHeaders = [
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
            onClick={() => this.changeGallery(row.id)}
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

    let albumHeaders = [
      {
        key: 'id',
        title: 'ID',
        sortable: true,
        sortDirection: 'desc'
      },
      {
        key: 'thumbnail',
        title: 'Thumbnail',
        sortable: false,
        sortDirection: '',
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
        sortDirection: ''
      },
      {
        key: 'published',
        title: 'Published',
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
        key: 'videoCount',
        title: '# Videos',
        sortable: true,
        sortDirection: ''
      }
    ];

    let videoHeaders = [
      {key: 'id', title: 'ID', sortable: true, sortDirection: 'desc'},
      {key: 'thumbnail', title: 'Thumbnail', sortable: false, sortDirection: ''}, //formatter: (row, cellData) => {return <Link to={'/ticket/' + row.ticketNumber}>{cellData}</Link>}},
      {key: 'title', title: 'Title', sortable: true, sortDirection: ''}, //formatter: (row, cellData) => {return <Link to={'/ticket/' + row.ticketNumber}>{cellData}</Link>}},
      {key: 'published', title: 'Published', sortable: true, sortDirection: ''},
      {key: 'dateAdded', title: 'Date Added', sortable: true, sortDirection: ''},
    ];

    if (this.state.selectedAlbum != undefined)
      return <Griddle
        headers={videoHeaders}
        recordLabel="videos"
      />
    else if (this.state.selectedGallery != undefined)
      return <Griddle
        headers={albumHeaders}
        recordLabel="albums"
        apiLoadPath={'/wp-json/utubevideogallery/v1/galleries/' + this.state.selectedGallery + '/albums'}
        dataMapper={(data) =>
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
              record.videoCount = item.videoCount;
              newData.push(record);
            }

            return newData;
          }
        }
      />
    else
      return <Griddle
        headers={galleryHeaders}
        recordLabel="galleries"
        apiLoadPath="/wp-json/utubevideogallery/v1/galleries"
        dataMapper={(data) =>
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
        }
      />
  }

  getPlaylistsTable()
  {
    let galleryHeaders = [
      {key: 'id', title: 'ID', sortable: true, sortDirection: 'desc'},
      {key: 'galleryName', title: 'Name', sortable: true, sortDirection: ''}, //formatter: (row, cellData) => {return <Link to={'/ticket/' + row.ticketNumber}>{cellData}</Link>}},
      {key: 'shortcode', title: 'Shortcode', sortable: true, sortDirection: ''},
      {key: 'dateAdded', title: 'Date Added', sortable: true, sortDirection: ''},
      {key: 'albumsCount', title: '# Albums', sortable: true, sortDirection: ''}
    ];

    return <Griddle
      headers={galleryHeaders}
      recordLabel="playlists"
    />
  }


  render()
  {
    return (
      <div className="wrap utv-admin">
        <h2 id="utv-masthead">uTubeVideo Gallery</h2>
        <Tabs selected={2}>
          <Pane label="Galleries" iconClass="fa-gear">
            {this.getGalleriesTable()}
          </Pane>
          <Pane label="Playlists" iconClass="fa-gear">
            {this.getPlaylistsTable()}
          </Pane>
          <Pane label="Settings" iconClass="fa-gear">


            <Columns>
              <Column className="utv-left-two-thirds-column">
                <Card>
                  <SectionHeader text="General"/>
                  <FormField>
                    <Label text="Max Video Player Size"/>
                    <TextInput/>
                  </FormField>
                  <FormField>
                    <Label text="Thumbnail Width"/>
                    <TextInput/>
                  <FormField>
                  </FormField>
                    <Label text="Thumbnail Horizontal Padding"/>
                    <TextInput/>
                  </FormField>
                  <FormField>
                    <Label text="Thumbnail Vertical Padding"/>
                    <TextInput/>
                  </FormField>
                  <FormField>
                    <Label text="Thumbnail Border Radius"/>
                    <TextInput/>
                  </FormField>
                  <FormField>
                    <Label text="Overlay Color"/>
                    <TextInput/>
                  </FormField>
                  <FormField>
                    <Label text="Overlay Opacity"/>
                    <TextInput/>
                  </FormField>
                  <FormField>
                    <Label text="Skip Magnific Popup Script"/>
                    <Toggle/>
                  </FormField>
                  <SectionHeader text="YouTube"/>
                  <FormField>
                    <Label text="API Key"/>
                    <TextInput/>
                    <Label text="Controls Theme"/>
                    <TextInput/>
                    <Label text="Controls Color"/>
                    <TextInput/>
                    <Label text="Autoplay Videos"/>
                    <Toggle/>
                    <Label text="Hide Video Details"/>
                    <Toggle/>
                  </FormField>
                  <SectionHeader text="Vimeo"/>
                  <FormField>
                    <Label text="Autoplay Videos"/>
                    <Toggle/>
                    <Label text="Hide Video Details"/>
                    <Toggle/>
                  </FormField>
                  <FormField>
                    <input type="submit" name="utSaveOptsGeneral" value="Update Settings" className="button-primary"/>
                  </FormField>
                </Card>
              </Column>
              <Column className="utv-right-one-third-column">
                <Card>
                  <SectionHeader text="Status"/>
                  <div>
                    <i className="fas fa-check" style={{'color': '#2d8034', 'fontSize': '20px', 'marginRight': '10px'}}></i>
                    ImageMagick
                  </div>
                  <div>
                    <i className="fas fa-check" style={{'color': '#2d8034', 'fontSize': '20px', 'marginRight': '10px'}}></i>
                    GD
                  </div>
                  <SectionHeader text="Server Information"/>
                  <div>
                    PHP Version: 7.2.1
                  </div>
                </Card>
              </Column>
            </Columns>


          </Pane>
        </Tabs>
      </div>
    );
  }
}

export default Dashboard;
