import React from 'react';
import Card from '../shared/Card';
import FormField from '../shared/FormField';
import TextInput from '../shared/TextInput';
import Label from '../shared/Label';
import Columns from '../shared/Columns';
import Column from '../shared/Column';
import SectionHeader from '../shared/SectionHeader';
import Toggle from '../shared/Toggle';

class VideoAddTabView extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return (


      <div>
        <div className="utv-breadcrumbs">
          <a tabIndex="0" className="utv-breadcrumb-link" onClick={() => this.props.changeGallery(undefined)}>Galleries</a>
          <i className="utv-breadcrumb-divider fas fa-chevron-right"></i>
          <a tabIndex="0" className="utv-breadcrumb-link" onClick={() => this.props.changeAlbum(undefined)}>Master</a>
          <i className="utv-breadcrumb-divider fas fa-chevron-right"></i>
          <span className="utv-breadcrumb-static">Disney</span>
        </div>
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
            <Card className="utv-even-padding">
              <div className="utv-flexvideo utv-flexvideo-16x9">
                <iframe id="utv-video-preview" src="https://www.youtube.com/embed/cx53Eh0Di5k" allowfullscreen=""></iframe>
              </div>
            </Card>
          </Column>
        </Columns>
      </div>
    );
  }
}

export default VideoAddTabView;
