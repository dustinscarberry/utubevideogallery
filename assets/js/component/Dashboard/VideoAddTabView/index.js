import React from 'react';
import axios from 'axios';
import actions from './actions';
import utility from '../../shared/utility';
import Card from '../../shared/Card';
import Columns from '../../shared/Columns';
import Column from '../../shared/Column';
import SectionHeader from '../../shared/SectionHeader';
import ResponsiveIframe from '../../shared/ResponsiveIframe';
import Breadcrumbs from '../../shared/Breadcrumbs';
import Form from '../../shared/Form';
import FormField from '../../shared/FormField';
import Label from '../../shared/Label';
import FieldHint from '../../shared/FieldHint';
import TextInput from '../../shared/TextInput';
import URLInput from '../../shared/URLInput';
import Toggle from '../../shared/Toggle';
import SelectBox from '../../shared/SelectBox';
import NumberInput from '../../shared/NumberInput';
import TextBoxInput from '../../shared/TextBoxInput';
import SubmitButton from '../../shared/SubmitButton';
import CancelButton from '../../shared/CancelButton';

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
      showControls: false,
      startTime: undefined,
      endTime: undefined
    };
  }

  changeValue = (e) =>
  {
    this.setState({[e.target.name]: e.target.value});
  }

  changeCheckboxValue = (e) =>
  {
    this.setState({[e.target.name]: !this.state[e.target.name]});
  }

  changeURL = (e) =>
  {
    //reset state
    this.setState({
      source: undefined,
      url: e.target.value.trim(),
      sourceID: undefined
    });

    //parse url
    const urlParts = actions.parseURL(e.target.value);

    //update state
    if (urlParts)
      this.setState(urlParts);
  }

  addVideo = async() =>
  {
    //create video
    const rsp = await actions.createVideo(this.state, this.props.selectedAlbum);

    //user feedback
    if (utility.isValidResponse(rsp))
    {
      this.props.changeView();
      this.props.setFeedbackMessage(utvJSData.localization.feedbackVideoAdded);
    }
    else if (utility.isErrorResponse(rsp))
      this.props.setFeedbackMessage(utility.getErrorMessage(rsp), 'error');
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
                    name="showControls"
                    value={this.state.showControls}
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
              <ResponsiveIframe src={actions.getVideoPreview(
                this.state.source,
                this.state.sourceID,
                this.state.startTime,
                this.state.endTime
              )}/>
            </Card>
          </Column>
        </Columns>
      </div>
    );
  }
}

export default VideoAddTabView;
