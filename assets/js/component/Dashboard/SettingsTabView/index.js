import React from 'react';
import actions from './actions';
import utility from 'component/shared/utility';
import Card from 'component/shared/Card';
import Form from 'component/shared/Form';
import FormField from 'component/shared/FormField';
import TextInput from 'component/shared/TextInput';
import FieldHint from 'component/shared/FieldHint';
import Label from 'component/shared/Label';
import Columns from 'component/shared/Columns';
import Column from 'component/shared/Column';
import SectionHeader from 'component/shared/SectionHeader';
import Toggle from 'component/shared/Toggle';
import SelectBox from 'component/shared/SelectBox';
import SecondaryButton from 'component/shared/SecondaryButton';
import SubmitButton from 'component/shared/SubmitButton';
import InfoLine from 'component/shared/InfoLine';
import Loader from 'component/shared/Loader';

class SettingsTabView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      gdEnabled: undefined,
      gdVersion: undefined,
      imageMagickEnabled: undefined,
      imageMagickVersion: undefined,
      phpVersion: undefined,
      version: undefined,
      wpVersion: undefined,
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
      showVideoDescription: undefined,
      vimeoAutoplay: undefined,
      vimeoHideDetails: undefined,
      youtubeAPIKey: undefined,
      youtubeAPIKeyValid: undefined,
      youtubeAPIKeyValidMessage: undefined,
      youtubeAutoplay: undefined,
      youtubeHideDetails: undefined,
      loading: true
    };
  }

  async componentDidMount()
  {
    await this.loadData();

    this.setState({loading: false});
  }

  async loadData()
  {
    const apiData = await actions.fetchSettings();

    if (utility.isValidResponse(apiData))
    {
      const data = utility.getAPIData(apiData);

      this.setState({
        gdEnabled: data.gdEnabled,
        gdVersion: data.gdVersion,
        imageMagickEnabled: data.imageMagickEnabled,
        imageMagickVersion: data.imageMagickVersion,
        phpVersion: data.phpVersion,
        version: data.version,
        wpVersion: data.wpVersion,
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
        showVideoDescription: data.showVideoDescription,
        vimeoAutoplay: data.vimeoAutoplay,
        vimeoHideDetails: data.vimeoHideDetails,
        youtubeAPIKey: data.youtubeAPIKey,
        youtubeAPIKeyValid: data.youtubeApiKeyValid,
        youtubeAPIKeyValidMessage: data.youtubeApiKeyValidMessage,
        youtubeAutoplay: data.youtubeAutoplay,
        youtubeHideDetails: data.youtubeHideDetails
      });
    }
    else if (utility.isErrorResponse(apiData))
      this.props.setFeedbackMessage(utility.getErrorMessage(apiData), 'error');
  }

  saveSettings = async() =>
  {
    this.setState({loading: true});

    //update settings
    const rsp = await actions.updateSettings(this.state);

    //update thumbnails if width changed
    if (this.state.thumbnailWidth != this.state.originalThumbnailWidth)
    {
      await this.rebuildThumbnails();
      this.setState({originalThumbnailWidth: this.state.thumbnailWidth});
    }

    // reload settings
    await this.loadData();

    //user feedback
    if (utility.isValidResponse(rsp))
      this.props.setFeedbackMessage(utvJSData.localization.feedbackSettingsSaved);
    else if (utility.isErrorResponse(rsp))
      this.props.setFeedbackMessage(utility.getErrorMessage(rsp), 'error');

    this.setState({loading: false});
  }

  rebuildThumbnails = async() =>
  {
    this.setState({loading: true});

    //get all videos
    const videosData = await actions.fetchAllVideos();

    if (utility.isValidResponse(videosData))
    {
      const videos = utility.getAPIData(videosData);

      for (let video of videos)
      {
        //update video thumbnail
        const rsp = await actions.updateVideoThumbnail(video.id);

        //user feedback for thumbnail update
        this.props.setFeedbackMessage(actions.getThumbnailUpdateMessage(video.title));
      }
    }
    else if (utility.isErrorResponse(videosData))
      this.props.setFeedbackMessage(utility.getErrorMessage(videosData), 'error');

    this.setState({loading: false});
  }

  changeValue = (e) =>
  {
    this.setState({[e.target.name]: e.target.value});
  }

  changeCheckboxValue = (e) =>
  {
    this.setState({[e.target.name]: !this.state[e.target.name]});
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
              <SectionHeader text={utvJSData.localization.serverInformation}/>
              <InfoLine text={utvJSData.localization.phpVersion + ': ' + this.state.phpVersion}/>
              <InfoLine text={utvJSData.localization.pluginVersion + ': ' + this.state.version}/>
              <InfoLine text={utvJSData.localization.wpVersion + ': ' + this.state.wpVersion}/>
              <SectionHeader text={utvJSData.localization.status}/>
              <InfoLine
                text={'ImageMagick - ' + this.state.imageMagickVersion}
                icon={this.state.imageMagickEnabled ? 'active' : 'inactive'}
              />
              <InfoLine
                text={'GD - ' + this.state.gdVersion}
                icon={this.state.gdEnabled ? 'active' : 'inactive'}
              />
              <FormField classes="utv-formfield-action">
                <SubmitButton
                  title={utvJSData.localization.updateSettings}
                  classes="button-primary"
                />
                <SecondaryButton
                  title={utvJSData.localization.resyncThumbnails}
                  onClick={this.rebuildThumbnails}
                />
              </FormField>
            </Card>
          </Column>
          <Column className="utv-left-two-thirds-column">
            <Card>
              <SectionHeader text={utvJSData.localization.general}/>
              <FormField>
                <Label text={utvJSData.localization.maxPlayerWidth}/>
                <TextInput
                  name="popupPlayerWidth"
                  value={this.state.popupPlayerWidth}
                  onChange={this.changeValue}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.thumbnailWidth}/>
                <TextInput
                  name="thumbnailWidth"
                  value={this.state.thumbnailWidth}
                  onChange={this.changeValue}
                />
              <FormField>
              </FormField>
                <Label text={utvJSData.localization.thumbnailPadding}/>
                <TextInput
                  name="thumbnailHorizontalPadding"
                  value={this.state.thumbnailHorizontalPadding}
                  onChange={this.changeValue}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.thumbnailBorderRadius}/>
                <TextInput
                  name="thumbnailBorderRadius"
                  value={this.state.thumbnailBorderRadius}
                  onChange={this.changeValue}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.overlayColor}/>
                <TextInput
                  name="popupPlayerOverlayColor"
                  value={this.state.popupPlayerOverlayColor}
                  onChange={this.changeValue}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.overlayOpactiy}/>
                <TextInput
                  name="popupPlayerOverlayOpacity"
                  value={this.state.popupPlayerOverlayOpacity}
                  onChange={this.changeValue}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.showVideoDescription}/>
                <Toggle
                  name="showVideoDescription"
                  value={this.state.showVideoDescription}
                  onChange={this.changeCheckboxValue}
                />
                <FieldHint text={utvJSData.localization.showVideoDescriptionHint}/>
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.removeVideoPopupScripts}/>
                <Toggle
                  name="removeVideoPopupScript"
                  value={this.state.removeVideoPopupScript}
                  onChange={this.changeCheckboxValue}
                />
                <FieldHint text={utvJSData.localization.removeVideoPopupScriptsHint}/>
              </FormField>
            </Card>
            <Card>
              <SectionHeader text="YouTube"/>
              <FormField>
                <Label text={utvJSData.localization.apiKey}/>
                <TextInput
                  name="youtubeAPIKey"
                  value={this.state.youtubeAPIKey}
                  onChange={this.changeValue}
                />
                <InfoLine
                  text={this.state.youtubeAPIKeyValidMessage}
                  icon={this.state.youtubeAPIKeyValid ? 'active' : 'inactive'}
                />
              <FieldHint text="Youtube API Key"/>
                <Label text={utvJSData.localization.youtubeControlsTheme}/>
                <SelectBox
                  name="playerControlsTheme"
                  value={this.state.playerControlsTheme}
                  onChange={this.changeValue}
                  choices={[
                    {name: utvJSData.localization.light, value: 'light'},
                    {name: utvJSData.localization.dark, value: 'dark'}
                  ]}
                />
                <Label text={utvJSData.localization.youtubeControlsColor}/>
                <SelectBox
                  name="playerControlsColor"
                  value={this.state.playerControlsColor}
                  onChange={this.changeValue}
                  choices={[
                    {name: utvJSData.localization.red, value: 'red'},
                    {name: utvJSData.localization.white, value: 'white'}
                  ]}
                />
                <Label text={utvJSData.localization.autoplayVideos}/>
                <Toggle
                  name="youtubeAutoplay"
                  value={this.state.youtubeAutoplay}
                  onChange={this.changeCheckboxValue}
                />
                <Label text={utvJSData.localization.hideVideoDetails}/>
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
                <Label text={utvJSData.localization.autoplayVideos}/>
                <Toggle
                  name="vimeoAutoplay"
                  value={this.state.vimeoAutoplay}
                  onChange={this.changeCheckboxValue}
                />
                <Label text={utvJSData.localization.hideVideoDetails}/>
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
