import React from 'react';
import Card from '../shared/Card';
import FormField from '../shared/FormField';
import TextInput from '../shared/TextInput';
import Label from '../shared/Label';
import Columns from '../shared/Columns';
import Column from '../shared/Column';
import SectionHeader from '../shared/SectionHeader';
import Toggle from '../shared/Toggle';

class SettingsTabView extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return (
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
    );
  }
}

export default SettingsTabView;
