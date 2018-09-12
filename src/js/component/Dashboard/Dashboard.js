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
import GalleryTable from './GalleryTable';
import AlbumTable from './AlbumTable';
import VideoTable from './VideoTable';
import PlaylistTable from './PlaylistTable';

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
    if (this.state.selectedAlbum != undefined)
      return <VideoTable
        selectedGallery={this.state.selectedGallery}
        selectedAlbum={this.state.selectedAlbum}
      />
    else if (this.state.selectedGallery != undefined)
      return <AlbumTable
        changeAlbum={this.changeAlbum}
        selectedGallery={this.state.selectedGallery}
      />
    else
      return <GalleryTable
        changeGallery={this.changeGallery}
      />
  }

  getPlaylistsTable()
  {
    return <PlaylistTable
      changeGallery={this.changeGallery}
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
