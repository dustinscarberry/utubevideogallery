import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import logic from './logic';
import apiHelper from 'helpers/api-helpers';
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
  constructor(props) {
    super(props);
    this.state = {
      settings: {
        gdEnabled: undefined,
        gdVersion: undefined,
        imageMagickEnabled: undefined,
        imageMagickVersion: undefined,
        phpVersion: undefined,
        version: undefined,
        wpVersion: undefined,
        playerControlsColor: undefined,
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
        youtubeHideDetails: undefined
      },
      isLoading: true
    };
  }

  async componentDidMount() {
    await this.loadData();
    this.setState({isLoading: false});
  }

  loadData = async () => {
    const apiData = await logic.fetchSettings();

    if (apiHelper.isValidResponse(apiData)) {
      const data = apiData.data.data;

      this.setState({settings: {
        gdEnabled: data.gdEnabled,
        gdVersion: data.gdVersion,
        imageMagickEnabled: data.imageMagickEnabled,
        imageMagickVersion: data.imageMagickVersion,
        phpVersion: data.phpVersion,
        version: data.version,
        wpVersion: data.wpVersion,
        playerControlsColor: data.playerControlsColor,
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
      }});
    } else if (apiHelper.isErrorResponse(apiData))
      this.props.setFeedbackMessage(apiHelper.getErrorMessage(apiData), 'error');
  }

  saveSettings = async () => {
    const { settings } = this.state;
    const { setFeedbackMessage } = this.props;

    this.setState({isLoading: true});

    // update settings
    const rsp = await logic.updateSettings(settings);

    // update thumbnails if width setting changed
    if (settings.thumbnailWidth != settings.originalThumbnailWidth) {
      await this.rebuildThumbnails();
      const settingsClone = cloneDeep(settings);
      settingsClone.originalThumbnailWidth = settingsClone.thumbnailWidth;
      this.setState({settings: settingsClone});
    }

    // reload settings
    await this.loadData();

    // user feedback
    if (apiHelper.isValidResponse(rsp))
      setFeedbackMessage(utvJSData.localization.feedbackSettingsSaved);
    else if (apiHelper.isErrorResponse(rsp))
      setFeedbackMessage(apiHelper.getErrorMessage(rsp), 'error');

    this.setState({isLoading: false});
  }

  rebuildThumbnails = async () => {
    const { setFeedbackMessage } = this.props;

    this.setState({isLoading: true});

    // get all videos
    const videosData = await logic.fetchAllVideos();

    if (apiHelper.isValidResponse(videosData)) {
      const videos = videosData.data.data;

      // update each video thumbnail
      for (const video of videos) {
        const rsp = await logic.updateVideoThumbnail(video.id);
        setFeedbackMessage(logic.getThumbnailUpdateMessage(video.title));
      }
    } else if (apiHelper.isErrorResponse(videosData))
      setFeedbackMessage(apiHelper.getErrorMessage(videosData), 'error');

    this.setState({isLoading: false});
  }

  handleUpdateField = (e) => {
    const settings = cloneDeep(this.state.settings);
    settings[e.target.name] = e.target.value;
    this.setState({settings});
  }

  handleUpdateToggleField = (e) => {
    const settings = cloneDeep(this.state.settings);
    settings[e.target.name] = !settings[e.target.name];
    this.setState({settings});
  }

  render() {
    const { isLoading, settings } = this.state;

    if (isLoading) return <Loader/>

    return <Form
      submit={this.saveSettings}
      errorclass="utv-invalid-feedback"
    >
      <Columns>
        <Column className="utv-right-one-third-column">
          <Card>
            <SectionHeader text={utvJSData.localization.serverInformation}/>
            <InfoLine text={utvJSData.localization.phpVersion + ': ' + settings.phpVersion}/>
            <InfoLine text={utvJSData.localization.pluginVersion + ': ' + settings.version}/>
            <InfoLine text={utvJSData.localization.wpVersion + ': ' + settings.wpVersion}/>
            <SectionHeader text={utvJSData.localization.status}/>
            <InfoLine
              text={'ImageMagick - ' + settings.imageMagickVersion}
              icon={settings.imageMagickEnabled ? 'active' : 'inactive'}
            />
            <InfoLine
              text={'GD - ' + settings.gdVersion}
              icon={settings.gdEnabled ? 'active' : 'inactive'}
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
                value={settings.popupPlayerWidth}
                onChange={this.handleUpdateField}
              />
            </FormField>
            <FormField>
              <Label text={utvJSData.localization.thumbnailWidth}/>
              <TextInput
                name="thumbnailWidth"
                value={settings.thumbnailWidth}
                onChange={this.handleUpdateField}
              />
            <FormField>
            </FormField>
              <Label text={utvJSData.localization.thumbnailPadding}/>
              <TextInput
                name="thumbnailHorizontalPadding"
                value={settings.thumbnailHorizontalPadding}
                onChange={this.handleUpdateField}
              />
            </FormField>
            <FormField>
              <Label text={utvJSData.localization.thumbnailBorderRadius}/>
              <TextInput
                name="thumbnailBorderRadius"
                value={settings.thumbnailBorderRadius}
                onChange={this.handleUpdateField}
              />
            </FormField>
            <FormField>
              <Label text={utvJSData.localization.overlayColor}/>
              <TextInput
                name="popupPlayerOverlayColor"
                value={settings.popupPlayerOverlayColor}
                onChange={this.handleUpdateField}
              />
            </FormField>
            <FormField>
              <Label text={utvJSData.localization.overlayOpactiy}/>
              <TextInput
                name="popupPlayerOverlayOpacity"
                value={settings.popupPlayerOverlayOpacity}
                onChange={this.handleUpdateField}
              />
            </FormField>
            <FormField>
              <Label text={utvJSData.localization.showVideoDescription}/>
              <Toggle
                name="showVideoDescription"
                value={settings.showVideoDescription}
                onChange={this.handleUpdateToggleField}
              />
              <FieldHint text={utvJSData.localization.showVideoDescriptionHint}/>
            </FormField>
            <FormField>
              <Label text={utvJSData.localization.removeVideoPopupScripts}/>
              <Toggle
                name="removeVideoPopupScript"
                value={settings.removeVideoPopupScript}
                onChange={this.handleUpdateToggleField}
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
                value={settings.youtubeAPIKey}
                onChange={this.handleUpdateField}
              />
              <InfoLine
                text={settings.youtubeAPIKeyValidMessage}
                icon={settings.youtubeAPIKeyValid ? 'active' : 'inactive'}
                isHTML={true}
              />
              <FieldHint text="Youtube API Key"/>
              <Label text={utvJSData.localization.youtubeControlsColor}/>
              <SelectBox
                name="playerControlsColor"
                value={settings.playerControlsColor}
                onChange={this.handleUpdateField}
                choices={[
                  {name: utvJSData.localization.red, value: 'red'},
                  {name: utvJSData.localization.white, value: 'white'}
                ]}
              />
              <Label text={utvJSData.localization.autoplayVideos}/>
              <Toggle
                name="youtubeAutoplay"
                value={settings.youtubeAutoplay}
                onChange={this.handleUpdateToggleField}
              />
              <Label text={utvJSData.localization.hideVideoDetails}/>
              <Toggle
                name="youtubeHideDetails"
                value={settings.youtubeHideDetails}
                onChange={this.handleUpdateToggleField}
              />
            </FormField>
            </Card>
            <Card>
            <SectionHeader text="Vimeo"/>
            <FormField>
              <Label text={utvJSData.localization.autoplayVideos}/>
              <Toggle
                name="vimeoAutoplay"
                value={settings.vimeoAutoplay}
                onChange={this.handleUpdateToggleField}
              />
              <Label text={utvJSData.localization.hideVideoDetails}/>
              <Toggle
                name="vimeoHideDetails"
                value={settings.vimeoHideDetails}
                onChange={this.handleUpdateToggleField}
              />
            </FormField>
            </Card>
        </Column>
      </Columns>
    </Form>
  }
}

export default SettingsTabView;
