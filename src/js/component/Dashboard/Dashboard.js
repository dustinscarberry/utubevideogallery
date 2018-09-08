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

class Dashboard extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return (
      <div className="wrap utv-admin">
        <h2 id="utv-masthead">uTubeVideo Gallery</h2>



        <Tabs selected={2}>
          <Pane label="Galleries" iconClass="fa-gear">
            <Card>
              <p>Galleries</p>
            </Card>
          </Pane>
          <Pane label="Playlists" iconClass="fa-gear">
            <Card>
              <p>Playlists</p>
            </Card>
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
                    <TextInput/>
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
                    <TextInput/>
                    <Label text="Hide Video Details"/>
                    <TextInput/>
                  </FormField>
                  <SectionHeader text="Vimeo"/>
                  <FormField>
                    <Label text="Autoplay Videos"/>
                    <TextInput/>
                    <Label text="Hide Video Details"/>
                    <TextInput/>
                  </FormField>
                  <FormField>
                    <input type="submit" name="utSaveOptsGeneral" value="Update Settings" className="button-primary"/>
                  </FormField>
                </Card>
              </Column>
              <Column className="utv-right-one-third-column">
                <Card>
                  <SectionHeader text="Status"/>
                  <p>ImageMagick</p>
                  <p>GD</p>
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
