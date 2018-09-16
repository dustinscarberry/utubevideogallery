import React from 'react';
import Card from './Card';
import FormField from './FormField';
import TextInput from './TextInput';
import Label from './Label';
import Columns from './Columns';
import Column from './Column';
import SectionHeader from './SectionHeader';
import Toggle from './Toggle';

class VideoAddTabView extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return (
      <Columns>
        <Column className="utv-left-one-thirds-column">
          <Card>
            <SectionHeader text="Add Video"/>
            <FormField>
              <Label text="URL"/>
              <TextInput/>
            </FormField>
            <FormField>
              <Label text="Name"/>
              <TextInput/>
            </FormField>
            <FormField>
              <Label text="Quality"/>
              <TextInput/>
            </FormField>
            <FormField>
              <Label text="Controls"/>
              <Toggle/>
            </FormField>
            <FormField>
              <Label text="Start Time"/>
              <TextInput/>
            </FormField>
            <FormField>
              <Label text="End Time"/>
              <TextInput/>
            </FormField>
          </Card>
        </Column>
        <Column className="utv-right-two-thirds-column">
          <Card>
            <div className="utv-flexvideo utv-flexvideo-16x9">
              <iframe id="utv-video-preview" src="https://www.youtube.com/embed/cx53Eh0Di5k" allowfullscreen=""></iframe>           
            </div>
          </Card>
        </Column>
      </Columns>
    );
  }
}

export default VideoAddTabView;
