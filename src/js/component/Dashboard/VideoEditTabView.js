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
import TextBoxInput from '../shared/TextBoxInput';
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
      description: '',
      quality: undefined,
      controls: undefined,
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
    await Promise.all([
      this.loadData(),
      this.loadAlbums()
    ]);

    //set loading state
    this.setState({loading: false});
  }

  async loadData()
  {
    const apiData = await axios.get(
      '/wp-json/utubevideogallery/v1/videos/'
      + this.props.currentViewID,
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (
      apiData.status == 200
      && !apiData.data.error
    )
    {
      const data = apiData.data.data;

      this.setState({
        thumbnail: data.thumbnail,
        source: data.source,
        urlKey: data.url,
        title: data.title,
        description: data.description,
        quality: data.quality,
        controls: data.showChrome == 1 ? true : false,
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
    const apiData = await axios.get(
      '/wp-json/utubevideogallery/v1/galleries/'
      + this.props.selectedGallery
      + '/albums'
    );

    if (
      apiData.status == 200
      && !apiData.data.error
    )
    {
      const data = apiData.data.data;
      const albums = [];

      for (const album of data)
        albums.push({
          name: album.title,
          value: album.id
        });

      this.setState({albums});
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
    const rsp = await axios.patch(
      '/wp-json/utubevideogallery/v1/videos/'
      + this.props.currentViewID,
      {
        title: this.state.title,
        description: this.state.description,
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

    console.log(rsp.data);

    if (
      rsp.status == 200
      && !rsp.data.error
    )
    {
      this.props.changeView();
      this.props.setFeedbackMessage('Video changes saved', 'success');
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
    let sourceFormatted = undefined;

    if (this.state.source == 'youtube')
      sourceFormatted = 'YouTube';
    else if (this.state.source == 'vimeo')
      sourceFormatted = 'Vimeo';

    const updateDate = new Date(this.state.updateDate * 1000);
    const updateDateFormatted = updateDate.toLocaleString(
      'en-US',
      {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }
    );

    //show loader while form is loading
    if (this.state.loading)
      return <Loader/>;

    return (
      <div>
        <Breadcrumbs
          crumbs={[
            {text: 'Galleries', onClick: () => this.props.changeGallery()},
            {text: this.props.selectedGalleryTitle, onClick: () => this.props.changeAlbum()},
            {text: this.props.selectedAlbumTitle, onClick: () => this.props.changeView()}
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
                    value={sourceFormatted}
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
                  <Label text="Description"/>
                  <TextBoxInput
                    name="description"
                    value={this.state.description}
                    onChange={this.changeValue}
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
                      {name: '1080p', value: 'hd1080'},
                      {name: '720p', value: 'hd720'},
                      {name: '480p', value: 'large'}
                    ]}
                  />
                </FormField>
                <FormField>
                  <Label text="Show Controls"/>
                  <Toggle
                    name="controls"
                    value={this.state.controls}
                    onChange={this.changeCheckboxValue}
                  />
                  <FieldHint text="Show player controls"/>
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

export default VideoEditTabView;
