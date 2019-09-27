import React from 'react';
import axios from 'axios';
import Card from '../shared/Card';
import Columns from '../shared/Columns';
import Column from '../shared/Column';
import SectionHeader from '../shared/SectionHeader';
import ResponsiveIframe from '../shared/ResponsiveIframe';
import Breadcrumbs from '../shared/Breadcrumbs';
import Form from '../shared/Form';
import FormField from '../shared/FormField';
import Label from '../shared/Label';
import FieldHint from '../shared/FieldHint';
import TextInput from '../shared/TextInput';
import URLInput from '../shared/URLInput';
import Toggle from '../shared/Toggle';
import SelectBox from '../shared/SelectBox';
import NumberInput from '../shared/NumberInput';
import TextBoxInput from '../shared/TextBoxInput';
import SubmitButton from '../shared/SubmitButton';
import CancelButton from '../shared/CancelButton';

class VideoAddTabView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      source: undefined,
      url: '',
      sourceID: undefined,
      title: '',
      description: '',
      quality: 'hd1080',
      controls: false,
      startTime: undefined,
      endTime: undefined
    };

    this.changeValue = this.changeValue.bind(this);
    this.changeCheckboxValue = this.changeCheckboxValue.bind(this);
    this.changeURL = this.changeURL.bind(this);
    this.addVideo = this.addVideo.bind(this);
  }

  changeValue(event)
  {
    this.setState({[event.target.name]: event.target.value});
  }

  changeCheckboxValue(event)
  {
    this.setState({[event.target.name]: !this.state[event.target.name]});
  }

  changeURL(event)
  {
    let url = event.target.value.trim();

    this.setState(
    {
      source: undefined,
      url: url,
      sourceID: undefined
    });

    if (url)
    {
      const compareURL = url.toLowerCase();

      if (
        compareURL.indexOf('youtube') !== -1
        || compareURL.indexOf('youtu.be') !== -1
      )
      {
        let matches = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);

        if (matches)
          this.setState({source: 'youtube', sourceID: matches[1]});
      }
      else if (compareURL.indexOf('vimeo') !== -1)
      {
        let matches = url.match(/https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/);

        if (matches)
          this.setState({source: 'vimeo', sourceID: matches[2]})
      }
    }
  }

  async addVideo()
  {
    const rsp = await axios.post(
      '/wp-json/utubevideogallery/v1/videos/',
      {
        sourceID: this.state.sourceID,
        title: this.state.title,
        description: this.state.description,
        quality: this.state.quality,
        controls: this.state.controls,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        source: this.state.source,
        albumID: this.props.selectedAlbum
      },
      { headers: {'X-WP-Nonce': utvJSData.restNonce} }
    );

    if (rsp.status == 201 && !rsp.data.error)
    {
      this.props.changeView();
      this.props.setFeedbackMessage(utvJSData.localization.feedbackVideoAdded, 'success');
    }
    else
      this.props.setFeedbackMessage(rsp.data.error.message, 'error');
  }

  getVideoPreview()
  {
    let src = '';

    if (this.state.source == 'youtube')
    {
      src = 'https://www.youtube.com/embed/';
      src += this.state.sourceID;
      src += '?modestbranding=1';
      src += '&rel=0';
      src += '&showinfo=0';
      src += '&autohide=0';
      src += '&iv_load_policy=3';
      src += '&color=white';
      src += '&theme=dark';
      src += '&autoplay=0';
      src += '&start=' + this.state.startTime;
      src += '&end=' + this.state.endTime;
    }
    else if (this.state.source == 'vimeo')
    {
      src = 'https://player.vimeo.com/video/';
      src += this.state.sourceID;
      src += '?title=0';
      src += '&portrait=0';
      src += '&byline=0';
      src += '&badge=0';
      src += '&autoplay=0';
      src += '#t=' + this.state.startTime;
    }

    return <ResponsiveIframe src={src}/>;
  }

  render()
  {
    return (
      <div>
        <Breadcrumbs
          crumbs={[
            {text: utvJSData.localization.galleries, onClick: () => this.props.changeGallery()},
            {text: this.props.selectedGalleryTitle, onClick: () => this.props.changeAlbum()},
            {text: this.props.selectedAlbumTitle}
          ]}
        />
        <Columns>
          <Column className="utv-left-one-thirds-column">
            <Card>
              <SectionHeader text={utvJSData.localization.addVideo}/>
              <Form
                submit={this.addVideo}
                errorclass="utv-invalid-feedback"
              >
                <FormField>
                  <Label text={utvJSData.localization.url}/>
                  <URLInput
                    name="url"
                    value={this.state.url}
                    onChange={this.changeURL}
                    required={true}
                  />
                </FormField>
                <FormField>
                  <Label text={utvJSData.localization.title}/>
                  <TextInput
                    name="title"
                    value={this.state.title}
                    onChange={this.changeValue}
                  />
                </FormField>
                <FormField>
                  <Label text={utvJSData.localization.description}/>
                  <TextBoxInput
                    name="description"
                    value={this.state.description}
                    onChange={this.changeValue}
                  />
                </FormField>
                <FormField>
                  <Label text={utvJSData.localization.quality}/>
                  <SelectBox
                    name="quality"
                    value={this.state.quality}
                    onChange={this.changeValue}
                    data={[
                      {name: '480p', value: 'large'},
                      {name: '720p', value: 'hd720'},
                      {name: '1080p', value: 'hd1080'}
                    ]}
                  />
                </FormField>
                <FormField>
                  <Label text={utvJSData.localization.controls}/>
                  <Toggle
                    name="controls"
                    value={this.state.controls}
                    onChange={this.changeCheckboxValue}
                  />
                  <FieldHint text={utvJSData.localization.showPlayerControlsHint}/>
                </FormField>
                <FormField>
                  <Label text={utvJSData.localization.startTime}/>
                  <NumberInput
                    name="startTime"
                    value={this.state.startTime}
                    onChange={this.changeValue}
                  />
                  <FieldHint text={utvJSData.localization.startTimeHint}/>
                </FormField>
                <FormField>
                  <Label text={utvJSData.localization.endTime}/>
                  <NumberInput
                    name="endTime"
                    value={this.state.endTime}
                    onChange={this.changeValue}
                  />
                  <FieldHint text={utvJSData.localization.endTimeHint}/>
                </FormField>
                <FormField classes="utv-formfield-action">
                  <SubmitButton
                    title={utvJSData.localization.addVideo}
                  />
                  <CancelButton
                    title={utvJSData.localization.cancel}
                    onClick={() => this.props.changeView()}
                  />
                </FormField>
              </Form>
            </Card>
          </Column>
          <Column className="utv-right-two-thirds-column">
            <Card classes="utv-even-padding">
              {this.getVideoPreview()}
            </Card>
          </Column>
        </Columns>
      </div>
    );
  }
}

export default VideoAddTabView;
