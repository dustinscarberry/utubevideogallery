import React from 'react';
import Card from '../shared/Card';
import Form from '../shared/Form';
import FormField from '../shared/FormField';
import TextInput from '../shared/TextInput';
import FieldHint from '../shared/FieldHint';
import Label from '../shared/Label';
import Columns from '../shared/Columns';
import Column from '../shared/Column';
import SectionHeader from '../shared/SectionHeader';
import Toggle from '../shared/Toggle';
import SelectBox from '../shared/SelectBox';
import SubmitButton from '../shared/SubmitButton';
import InfoLine from '../shared/InfoLine';
import Loader from '../shared/Loader';
import axios from 'axios';

class SettingsTabView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      gdEnabled: undefined,
      imageMagickEnabled: undefined,
      phpVersion: undefined,
      version: undefined,
      playerControlsColor: undefined,
      playerControlsTheme: undefined,
      popupPlayerWidth: undefined,
      popupPlayerOverlayColor: undefined,
      popupPlayerOverlayOpacity: undefined,
      removeVideoPopupScript: undefined,
      thumbnailBorderRadius: undefined,
      thumbnailWidth: undefined,
      originalThumbnailWidth: undefined,
      thumbnailHorizontalPadding: undefined,
      thumbnailVerticalPadding: undefined,
      vimeoAutoplay: undefined,
      vimeoHideDetails: undefined,
      youtubeAPIKey: undefined,
      youtubeAutoplay: undefined,
      youtubeHideDetails: undefined,
      loading: true
    };

    this.changeValue = this.changeValue.bind(this);
    this.changeCheckboxValue = this.changeCheckboxValue.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
  }

  async componentDidMount()
  {
    await this.loadData();

    this.setState({loading: false});
  }

  async loadData()
  {
    const apiData = await axios.get(
      '/wp-json/utubevideogallery/v1/settings',
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
        gdEnabled: data.gdEnabled,
        imageMagickEnabled: data.imageMagickEnabled,
        phpVersion: data.phpVersion,
        version: data.version,
        playerControlsColor: data.playerControlsColor,
        playerControlsTheme: data.playerControlsTheme,
        popupPlayerWidth: data.popupPlayerWidth,
        popupPlayerOverlayColor: data.popupPlayerOverlayColor,
        popupPlayerOverlayOpacity: data.popupPlayerOverlayOpacity,
        removeVideoPopupScript: data.removeVideoPopupScript,
        thumbnailBorderRadius: data.thumbnailBorderRadius,
        thumbnailWidth: data.thumbnailWidth,
        originalThumbnailWidth: data.thumbnailWidth,
        thumbnailHorizontalPadding: data.thumbnailHorizontalPadding,
        thumbnailVerticalPadding: data.thumbnailVerticalPadding,
        vimeoAutoplay: data.vimeoAutoplay,
        vimeoHideDetails: data.vimeoHideDetails,
        youtubeAPIKey: data.youtubeAPIKey,
        youtubeAutoplay: data.youtubeAutoplay,
        youtubeHideDetails: data.youtubeHideDetails
      });
    }
  }

  async saveSettings()
  {
    this.setState({loading: true});

    const rsp = await this.saveBaseSettings();

    //update thumbnails if width changed
    if (this.state.thumbnailWidth != this.state.originalThumbnailWidth)
    {
      await this.rebuildThumbnails();
      this.setState({originalThumbnailWidth: this.state.thumbnailWidth});
    }

    //final user feedback
    if (
      rsp.status == 200
      && !rsp.data.error
    )
      this.props.setFeedbackMessage('Settings saved', 'success');
    else
      this.props.setFeedbackMessage(rsp.data.error.message, 'error');

    this.setState({loading: false});
  }

  async saveBaseSettings()
  {
    const rsp = await axios.patch(
      '/wp-json/utubevideogallery/v1/settings',
      {
        playerControlsColor: this.state.playerControlsColor,
        playerControlsTheme: this.state.playerControlsTheme,
        popupPlayerWidth: this.state.popupPlayerWidth,
        popupPlayerOverlayColor: this.state.popupPlayerOverlayColor,
        popupPlayerOverlayOpacity: this.state.popupPlayerOverlayOpacity,
        removeVideoPopupScript: this.state.removeVideoPopupScript,
        thumbnailBorderRadius: this.state.thumbnailBorderRadius,
        thumbnailWidth: this.state.thumbnailWidth,
        thumbnailHorizontalPadding: this.state.thumbnailHorizontalPadding,
        thumbnailVerticalPadding: this.state.thumbnailVerticalPadding,
        vimeoAutoplay: this.state.vimeoAutoplay,
        vimeoHideDetails: this.state.vimeoHideDetails,
        youtubeAPIKey: this.state.youtubeAPIKey,
        youtubeAutoplay: this.state.youtubeAutoplay,
        youtubeHideDetails: this.state.youtubeHideDetails
      },
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    return rsp;
  }

  async rebuildThumbnails()
  {
    const videosData = await axios.get(
      '/wp-json/utubevideogallery/v1/videos',
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (
      videosData.status == 200
      && !videosData.data.error
    )
    {
      const videos = videosData.data.data;

      for (let video of videos)
      {
        const rsp = await axios.patch(
          '/wp-json/utubevideogallery/v1/videos/'
          + video.id,
          {},
          {
            headers: {'X-WP-Nonce': utvJSData.restNonce}
          }
        );

        //update status about what video is being rebuilt
        this.props.setFeedbackMessage(
          'Video ['
          + video.title
          + '] updated',
          'success'
        );
      }
    }
  }

  changeValue(event)
  {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  changeCheckboxValue(event)
  {
    this.setState({
      [event.target.name]: !this.state[event.target.name]
    });
  }

  render()
  {
    if (this.state.loading)
      return <Loader/>;

    return (
      <Form
        submit={this.saveSettings}
        errorclass="utv-invalid-feedback"
      >
        <Columns>
          <Column className="utv-right-one-third-column">
            <Card>
              <SectionHeader text="Server Information"/>
              <InfoLine text={'PHP Version: ' + this.state.phpVersion}/>
              <InfoLine text={'Plugin Version: ' + this.state.version}/>
              <SectionHeader text="Status"/>
              <InfoLine
                text="ImageMagick"
                icon={this.state.imageMagickEnabled ? 'active' : 'inactive'}
              />
              <InfoLine
                text="GD"
                icon={this.state.gdEnabled ? 'active' : 'inactive'}
              />
              <FormField classes="utv-formfield-action">
                <SubmitButton
                  title="Update Settings"
                  classes="button-primary"
                />
              </FormField>
            </Card>
          </Column>
          <Column className="utv-left-two-thirds-column">
            <Card>
              <SectionHeader text="General"/>
              <FormField>
                <Label text="Max Player Width"/>
                <TextInput
                  name="popupPlayerWidth"
                  value={this.state.popupPlayerWidth}
                  onChange={this.changeValue}
                />
              </FormField>
              <FormField>
                <Label text="Thumbnail Width"/>
                <TextInput
                  name="thumbnailWidth"
                  value={this.state.thumbnailWidth}
                  onChange={this.changeValue}
                />
              <FormField>
              </FormField>
                <Label text="Thumbnail Horizontal Padding"/>
                <TextInput
                  name="thumbnailHorizontalPadding"
                  value={this.state.thumbnailHorizontalPadding}
                  onChange={this.changeValue}
                />
              </FormField>
              <FormField>
                <Label text="Thumbnail Vertical Padding"/>
                <TextInput
                  name="thumbnailVerticalPadding"
                  value={this.state.thumbnailVerticalPadding}
                  onChange={this.changeValue}
                />
              </FormField>
              <FormField>
                <Label text="Thumbnail Border Radius"/>
                <TextInput
                  name="thumbnailBorderRadius"
                  value={this.state.thumbnailBorderRadius}
                  onChange={this.changeValue}
                />
              </FormField>
              <FormField>
                <Label text="Overlay Color"/>
                <TextInput
                  name="popupPlayerOverlayColor"
                  value={this.state.popupPlayerOverlayColor}
                  onChange={this.changeValue}
                />
              </FormField>
              <FormField>
                <Label text="Overlay Opacity"/>
                <TextInput
                  name="popupPlayerOverlayOpacity"
                  value={this.state.popupPlayerOverlayOpacity}
                  onChange={this.changeValue}
                />
              </FormField>
              <FormField>
                <Label text="Remove Video Popup Scripts"/>
                <Toggle
                  name="removeVideoPopupScript"
                  value={this.state.removeVideoPopupScript}
                  onChange={this.changeCheckboxValue}
                />
                <FieldHint text="Remove scripts if provided via another plugin"/>
              </FormField>
            </Card>
            <Card>
              <SectionHeader text="YouTube"/>
              <FormField>
                <Label text="API Key"/>
                <TextInput
                  name="youtubeAPIKey"
                  value={this.state.youtubeAPIKey}
                  onChange={this.changeValue}
                />
                <Label text="Controls Theme"/>
                <SelectBox
                  name="playerControlsTheme"
                  value={this.state.playerControlsTheme}
                  onChange={this.changeValue}
                  data={[
                    {name: 'Light', value: 'light'},
                    {name: 'Dark', value: 'dark'}
                  ]}
                />
                <Label text="Controls Color"/>
                <SelectBox
                  name="playerControlsColor"
                  value={this.state.playerControlsColor}
                  onChange={this.changeValue}
                  data={[
                    {name: 'Red', value: 'red'},
                    {name: 'White', value: 'white'}
                  ]}
                />
                <Label text="Autoplay Videos"/>
                <Toggle
                  name="youtubeAutoplay"
                  value={this.state.youtubeAutoplay}
                  onChange={this.changeCheckboxValue}
                />
                <Label text="Hide Video Details"/>
                <Toggle
                  name="youtubeHideDetails"
                  value={this.state.youtubeHideDetails}
                  onChange={this.changeCheckboxValue}
                />
              </FormField>
              </Card>
              <Card>
              <SectionHeader text="Vimeo"/>
              <FormField>
                <Label text="Autoplay Videos"/>
                <Toggle
                  name="vimeoAutoplay"
                  value={this.state.vimeoAutoplay}
                  onChange={this.changeCheckboxValue}
                />
                <Label text="Hide Video Details"/>
                <Toggle
                  name="vimeoHideDetails"
                  value={this.state.vimeoHideDetails}
                  onChange={this.changeCheckboxValue}
                />
              </FormField>
              </Card>
          </Column>
        </Columns>
      </Form>
    );
  }
}

export default SettingsTabView;
