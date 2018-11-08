import React from 'react';
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
import Toggle from '../shared/Toggle';
import SelectBox from '../shared/SelectBox';
import NumberInput from '../shared/NumberInput';
import Button from '../shared/Button';
import SubmitButton from '../shared/SubmitButton';
import Loader from '../shared/Loader';
import axios from 'axios';

class VideoEditTabView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      thumbnail: undefined,
      source: undefined,
      title: '',
      quality: undefined,
      controls: true,
      startTime: undefined,
      endTime: undefined,
      updateDate: undefined,
      album: undefined,
      albums: undefined,
      loading: true
    };

    this.changeValue = this.changeValue.bind(this);
    this.changeCheckboxValue = this.changeCheckboxValue.bind(this);
    this.saveVideo = this.saveVideo.bind(this);
  }

  async componentDidMount()
  {
    //load api data
    await Promise.all([this.loadData(), this.loadAlbums()]);

    //set loading state
    this.setState({loading: false});
  }

  async loadData()
  {
    let apiData = await axios.get(
      '/wp-json/utubevideogallery/v1/videos/' + this.props.currentViewID,
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (apiData.status == 200)
    {
      let data = apiData.data.data;

      this.setState({
        thumbnail: data.thumbnail,
        source: data.source,
        urlKey: data.url,
        title: data.title,
        quality: data.quality,
        controls: data.showChrome,
        startTime: data.startTime,
        endTime: data.endTime,
        updateDate: data.updateDate,
        album: data.albumID,
        loading: false
      });
    }
  }

  async loadAlbums()
  {
    let apiData = await axios.get(
      '/wp-json/utubevideogallery/v1/galleries/'
      + this.props.selectedGallery
      + '/albums'
    );

    if (apiData.status == 200)
    {
      let data = apiData.data.data;
      let albums = [];

      for (let album of data)
        albums.push({name: album.title, value: album.id});

      this.setState({albums: albums});
    }
  }

  changeValue(event)
  {
    this.setState({[event.target.name]: event.target.value});
  }

  changeCheckboxValue(event)
  {
    this.setState({[event.target.name]: !this.state[event.target.name]});
  }

  async saveVideo()
  {
    let apiData = await axios.patch(
      '/wp-json/utubevideogallery/v1/videos/'
      + this.props.currentViewID,
      {
        title: this.state.title,
        quality: this.state.quality,
        controls: this.state.controls,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        albumID: this.state.album
      },
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    console.log(apiData);

    if (apiData.status == 200)
    {
      this.props.changeView(undefined);
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
    let source = undefined;

    if (this.state.source == 'youtube')
      source = 'YouTube';
    else if (this.state.source == 'vimeo')
      source = 'Vimeo';

    let updateDate = new Date(this.state.updateDate * 1000);
    let updateDateFormatted = updateDate.getFullYear()
      + '/'
      + (updateDate.getMonth() + 1)
      + '/'
      + updateDate.getDate();

    //show loader while form is loading
    if (this.state.loading)
      return <Loader/>;

    return (
      <div>
        <Breadcrumbs
          crumbs={[
            {text: 'Galleries', onClick: () => this.props.changeGallery(undefined)},
            {text: 'Master', onClick: () => this.props.changeAlbum(undefined)},
            {text: 'Disney', onClick: () => this.props.changeView(undefined)}
          ]}
        />
        <Columns>
          <Column className="utv-left-one-thirds-column">
            <Card>
              <SectionHeader text="Edit Video"/>
              <Form
                submit={this.saveVideo}
                errorclass="utv-invalid-feedback"
              >
                <FormField>
                  <Label text="Source"/>
                  <TextInput
                    name="source"
                    value={source}
                    disabled={true}
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
                  <Label text="Album"/>
                  <SelectBox
                    name="album"
                    value={this.state.album}
                    onChange={this.changeValue}
                    data={this.state.albums}
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
                <FormField>
                  <Label text="Last Updated"/>
                  <TextInput
                    name="updateDateFormatted"
                    value={updateDateFormatted}
                    disabled={true}
                  />
                </FormField>
                <FormField classes="utv-formfield-action">
                  <SubmitButton
                    title="Save Video"
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

export default VideoEditTabView;
