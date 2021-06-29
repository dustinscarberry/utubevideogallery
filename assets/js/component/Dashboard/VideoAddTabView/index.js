import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import logic from './logic';
import apiHelper from 'helpers/api-helpers';

import Card from 'component/shared/Card';
import Columns from 'component/shared/Columns';
import Column from 'component/shared/Column';
import SectionHeader from 'component/shared/SectionHeader';
import ResponsiveIframe from 'component/shared/ResponsiveIframe';
import Breadcrumbs from 'component/shared/Breadcrumbs';
import Form from 'component/shared/Form';
import FormField from 'component/shared/FormField';
import Label from 'component/shared/Label';
import FieldHint from 'component/shared/FieldHint';
import TextInput from 'component/shared/TextInput';
import URLInput from 'component/shared/URLInput';
import Toggle from 'component/shared/Toggle';
import NumberInput from 'component/shared/NumberInput';
import TextBoxInput from 'component/shared/TextBoxInput';
import SubmitButton from 'component/shared/SubmitButton';
import CancelButton from 'component/shared/CancelButton';

class VideoAddTabView extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      video: {
        source: undefined,
        url: '',
        sourceID: undefined,
        title: '',
        description: '',
        showControls: false,
        startTime: undefined,
        endTime: undefined
      }
    };
  }

  handleUpdateField = (e) => {
    const video = cloneDeep(this.state.video);
    video[e.target.name] = e.target.value;
    this.setState({video});
  }

  handleUpdateToggleField = (e) => {
    const video = cloneDeep(this.state.video);
    video[e.target.name] = !video[e.target.name];
    this.setState({video});
  }

  handleUpdateUrl = (e) => {
    // reset state
    const video = cloneDeep(this.state.video);
    video.source = undefined;
    video.sourceID = undefined;
    video.url = e.target.value.trim();
    this.setState({video});

    // parse url
    const urlParts = logic.parseURL(e.target.value);

    if (urlParts) {
      video.source = urlParts.source;
      video.sourceID = urlParts.sourceID;
      this.setState({video});
    }
  }

  addVideo = async () => {
    const { video } = this.state;
    const { selectedAlbum, changeView, setFeedbackMessage } = this.props;

    // create video
    const rsp = await logic.createVideo(video, selectedAlbum);

    // user feedback
    if (apiHelper.isValidResponse(rsp)) {
      changeView();
      setFeedbackMessage(utvJSData.localization.feedbackVideoAdded);
    } else if (apiHelper.isErrorResponse(rsp))
      setFeedbackMessage(apiHelper.getErrorMessage(rsp), 'error');
  }

  render() {
    const { video } = this.state;

    return <div>
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
                  value={video.url}
                  onChange={this.handleUpdateUrl}
                  required={true}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.title}/>
                <TextInput
                  name="title"
                  value={video.title}
                  onChange={this.handleUpdateField}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.description}/>
                <TextBoxInput
                  name="description"
                  value={video.description}
                  onChange={this.handleUpdateField}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.controls}/>
                <Toggle
                  name="showControls"
                  value={video.showControls}
                  onChange={this.handleUpdateToggleField}
                />
                <FieldHint text={utvJSData.localization.showPlayerControlsHint}/>
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.startTime}/>
                <NumberInput
                  name="startTime"
                  value={video.startTime}
                  onChange={this.handleUpdateField}
                />
                <FieldHint text={utvJSData.localization.startTimeHint}/>
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.endTime}/>
                <NumberInput
                  name="endTime"
                  value={video.endTime}
                  onChange={this.handleUpdateField}
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
            <ResponsiveIframe src={logic.getVideoPreview(
              video.source,
              video.sourceID,
              video.startTime,
              video.endTime
            )}/>
          </Card>
        </Column>
      </Columns>
    </div>
  }
}

export default VideoAddTabView;
