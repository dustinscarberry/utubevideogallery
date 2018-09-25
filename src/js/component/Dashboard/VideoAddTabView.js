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
import Button from '../shared/Button';
import SubmitButton from '../shared/SubmitButton';

class VideoAddTabView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      source: undefined,
      url: '',
      urlKey: undefined,
      title: '',
      quality: undefined,
      controls: true,
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

    this.setState({source: undefined, url: url, urlKey: undefined});

    if (url && url != '')
    {
      let compareURL = url.toLowerCase();

      if (compareURL.indexOf('youtube') !== -1)
      {
        let matches = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);

        if (matches)
          this.setState({source: 'youtube', urlKey: matches[1]});
      }
      else if (compareURL.indexOf('vimeo') !== -1)
      {
        let matches = url.match(/https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/);

        if (matches)
          this.setState({source: 'vimeo', urlKey: matches[2]})
      }
    }
  }

  async addVideo()
  {
    let apiData = await axios.post(
      '/wp-json/utubevideogallery/v1/videos/',
      {
        urlKey: this.state.urlKey,
        title: this.state.title,
        quality: this.state.quality,
        controls: this.state.controls,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        source: this.state.source,
        albumID: this.props.selectedAlbum
      },
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (apiData.status == 200)
    {
      let data = apiData.data;
      console.log(data);
    }

  }

  getVideoPreview()
  {
    let src = '';

    if (this.state.source == 'youtube')
    {
      src = 'https://www.youtube.com/embed/';
      src += this.state.urlKey;
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
      src += this.state.urlKey;
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
            {text: 'Galleries', onClick: () => this.props.changeGallery(undefined)},
            {text: 'Master', onClick: () => this.props.changeAlbum(undefined)},
            {text: 'Disney'}
          ]}
        />
        <Columns>
          <Column className="utv-left-one-thirds-column">
            <Card>
              <SectionHeader text="Add Video"/>
              <Form
                submit={this.addVideo}
                errorclass="utv-invalid-feedback"
              >
                <FormField>
                  <Label text="URL"/>
                  <URLInput
                    name="url"
                    value={this.state.url}
                    onChange={this.changeURL}
                    required={true}
                  />
                </FormField>
                <FormField>
                  <Label text="Title"/>
                  <TextInput
                    name="title"
                    value={this.state.title}
                    onChange={this.changeValue}
                    required={true}
                  />
                </FormField>
                <FormField>
                  <Label text="Quality"/>
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
                  <Label text="Controls"/>
                  <Toggle
                    name="controls"
                    value={this.state.controls}
                    onChange={this.changeCheckboxValue}
                  />
                  <FieldHint text="Visible player controls"/>
                </FormField>
                <FormField>
                  <Label text="Start Time"/>
                  <NumberInput
                    name="startTime"
                    value={this.state.startTime}
                    onChange={this.changeValue}
                  />
                  <FieldHint text="Beginning timestamp (seconds)"/>
                </FormField>
                <FormField>
                  <Label text="End Time"/>
                  <NumberInput
                    name="endTime"
                    value={this.state.endTime}
                    onChange={this.changeValue}
                  />
                  <FieldHint text="Ending timestamp (seconds)"/>
                </FormField>
                <FormField classes="utv-formfield-action">
                  <SubmitButton
                    title="Add Video"
                    classes="button-primary"
                  />
                  <Button
                    title="Cancel"
                    classes="utv-cancel"
                    onClick={() => this.props.changeView(undefined)}
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
