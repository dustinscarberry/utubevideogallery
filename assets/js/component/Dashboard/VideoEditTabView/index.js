import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import actions from './actions';
import apiHelper from 'helpers/api-helpers';
import { getFormattedDateTime } from 'helpers/datetime-helpers';
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
import Toggle from 'component/shared/Toggle';
import SelectBox from 'component/shared/SelectBox';
import NumberInput from 'component/shared/NumberInput';
import TextBoxInput from 'component/shared/TextBoxInput';
import SubmitButton from 'component/shared/SubmitButton';
import CancelButton from 'component/shared/CancelButton';
import Loader from 'component/shared/Loader';

class VideoEditTabView extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      videoData: {
        thumbnail: undefined,
        source: undefined,
        sourceID: undefined,
        title: undefined,
        description: undefined,
        quality: undefined,
        showControls: undefined,
        startTime: '',
        endTime: '',
        updateDate: undefined,
        album: undefined
      },
      sharedData: {
        albums: undefined
      },
      isLoading: true
    };
  }

  async componentDidMount() {
    // load api data
    await Promise.all([
      this.loadData(),
      this.loadAlbums()
    ]);

    this.setState({isLoading: false});
  }

  loadData = async () => {
    // get video
    const apiData = await actions.fetchVideo(this.props.currentViewID);

    if (apiHelper.isValidResponse(apiData)) {
      const data = apiHelper.getAPIData(apiData);

      this.setState({
        thumbnail: data.thumbnail,
        source: data.source,
        sourceID: data.sourceID,
        title: data.title,
        description: data.description ? data.description : undefined,
        quality: data.quality,
        showControls: data.showControls == 1 ? true : false,
        startTime: data.startTime ? data.startTime : '',
        endTime: data.endTime ? data.endTime : '',
        updateDate: data.updateDate,
        album: data.albumID,
        isLoading: false
      });
    }
    else if (apiHelper.isErrorResponse(apiData))
      this.props.setFeedbackMessage(apiHelper.getErrorMessage(apiData), 'error');
  }

  loadAlbums = async () => {
    // get albums
    const apiData = await actions.fetchGalleryAlbums(this.props.selectedGallery);

    if (apiHelper.isValidResponse(apiData))
    {
      const data = apiHelper.getAPIData(apiData);
      const albums = actions.parseAlbumsData(data);
      this.setState({albums});
    }
    else if (apiHelper.isErrorResponse(apiData))
      this.props.setFeedbackMessage(apiHelper.getErrorMessage(apiData), 'error');
  }

  handleUpdateField = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  handleUpdateToggleField = (e) => {
    this.setState({[e.target.name]: !this.state[e.target.name]});
  }

  handleUpdateVideo = async () => {
    const { changeView, setFeedbackMessage } = this.props;

    // update video
    const rsp = await actions.updateVideo(this.props.currentViewID, {
      title: this.state.title,
      description: this.state.description,
      quality: this.state.quality,
      showControls: this.state.showControls,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      albumID: this.state.album
    });

    if (rsp === true) {
      changeView();
      setFeedbackMessage(utvJSData.localization.feedbackVideoSaved, 'success');
    } else
      setFeedbackMessage(rsp, 'error');
  }

  render() {
    const { isLoading } = this.state;

    if (isLoading) return <Loader/>;
/*
description: undefined,
title: undefined,
quality: undefined,
showControls: undefined,
startTime: '',
endTime: '',
album: undefined,
source: undefined,
updateDate: undefined
  sourceID: undefined,




    thumbnail: undefined,





  albums: undefined
    */




    return <>
      <Breadcrumbs
        crumbs={[
          {text: utvJSData.localization.galleries, onClick: () => this.props.changeGallery()},
          {text: this.props.selectedGalleryTitle, onClick: () => this.props.changeAlbum()},
          {text: this.props.selectedAlbumTitle, onClick: () => this.props.changeView()}
        ]}
      />
      <Columns>
        <Column className="utv-left-one-thirds-column">
          <Card>
            <SectionHeader text={utvJSData.localization.editVideo}/>
            <Form
              submit={this.handleUpdateVideo}
              errorclass="utv-invalid-feedback"
            >
              <FormField>
                <Label text={utvJSData.localization.source}/>
                <TextInput
                  name="source"
                  value={actions.getFormattedSource(this.state.source)}
                  disabled={true}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.title}/>
                <TextInput
                  name="title"
                  value={this.state.title}
                  onChange={this.handleUpdateField}
                  required={true}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.description}/>
                <TextBoxInput
                  name="description"
                  value={this.state.description}
                  onChange={this.handleUpdateField}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.album}/>
                <SelectBox
                  name="album"
                  value={this.state.album}
                  onChange={this.handleUpdateField}
                  choices={this.state.albums}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.quality}/>
                <SelectBox
                  name="quality"
                  value={this.state.quality}
                  onChange={this.handleUpdateField}
                  choices={[
                    {name: '1080p', value: 'hd1080'},
                    {name: '720p', value: 'hd720'},
                    {name: '480p', value: 'large'}
                  ]}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.controls}/>
                <Toggle
                  name="showControls"
                  value={this.state.showControls}
                  onChange={this.handleUpdateToggleField}
                />
                <FieldHint text={utvJSData.localization.showPlayerControlsHint}/>
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.startTime}/>
                <NumberInput
                  name="startTime"
                  value={this.state.startTime}
                  onChange={this.handleUpdateField}
                />
                <FieldHint text={utvJSData.localization.startTimeHint}/>
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.endTime}/>
                <NumberInput
                  name="endTime"
                  value={this.state.endTime}
                  onChange={this.handleUpdateField}
                />
                <FieldHint text={utvJSData.localization.endTimeHint}/>
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.lastUpdated}/>
                <TextInput
                  name="updateDateFormatted"
                  value={getFormattedDateTime(this.state.updateDate)}
                  disabled={true}
                />
              </FormField>
              <FormField classes="utv-formfield-action">
                <SubmitButton
                  title={utvJSData.localization.saveVideo}
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
    </>
  }
}

export default VideoEditTabView;
