import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import logic from './logic';
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
      video: {
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
      supportData: {
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
    const { currentViewID, setFeedbackMessage } = this.props;
    // get video
    const rsp = await logic.fetchVideo(currentViewID);

    if (apiHelper.isValidResponse(rsp)) {
      const data = rsp.data.data;
      const video = {
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
      };
      this.setState({video});
    } else if (apiHelper.isErrorResponse(apiData))
      setFeedbackMessage(apiHelper.getErrorMessage(apiData), 'error');
  }

  loadAlbums = async () => {
    const { selectedGallery, setFeedbackMessage } = this.props;
    // get albums
    const rsp = await logic.fetchGalleryAlbums(selectedGallery);

    if (apiHelper.isValidResponse(rsp)) {
      const supportData = cloneDeep(this.state.supportData);
      supportData.albums = logic.parseAlbumsData(rsp.data.data);
      this.setState({supportData});
    } else if (apiHelper.isErrorResponse(rsp))
      setFeedbackMessage(apiHelper.getErrorMessage(rsp), 'error');
  }

  handleUpdateField = (e) => {
    const video = cloneDeep(this.state.video);
    video[e.target.name] = e.target.value;
    this.setState({video});
  }

  handleUpdateToggleField = (e) => {
    const video = cloneDeep(this.state.video);
    video[e.target.name] = !video[e.target.value];
    this.setState({video});
  }

  handleUpdateVideo = async () => {
    const { currentViewID, changeView, setFeedbackMessage } = this.props;
    const { video } = this.state;

    // update video
    const rsp = await logic.updateVideo(currentViewID, video);

    if (apiHelper.isValidResponse(rsp)) {
      changeView();
      setFeedbackMessage(utvJSData.localization.feedbackVideoSaved, 'success');
    } else if (apiHelper.isErrorResponse(rsp))
      setFeedbackMessage(rsp, 'error');
  }

  render() {
    const { isLoading, video, supportData } = this.state;
    const { selectedGalleryTitle, selectedAlbumTitle, changeGallery, changeAlbum, changeView } = this.props;

    if (isLoading) return <Loader/>;

    return <>
      <Breadcrumbs
        crumbs={[
          {text: utvJSData.localization.galleries, onClick: () => changeGallery()},
          {text: selectedGalleryTitle, onClick: () => changeAlbum()},
          {text: selectedAlbumTitle, onClick: () => changeView()}
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
                  value={logic.getFormattedSource(video.source)}
                  disabled={true}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.title}/>
                <TextInput
                  name="title"
                  value={video.title}
                  onChange={this.handleUpdateField}
                  required={true}
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
                <Label text={utvJSData.localization.album}/>
                <SelectBox
                  name="album"
                  value={video.album}
                  onChange={this.handleUpdateField}
                  choices={supportData.albums}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.quality}/>
                <SelectBox
                  name="quality"
                  value={video.quality}
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
              <FormField>
                <Label text={utvJSData.localization.lastUpdated}/>
                <TextInput
                  name="updateDateFormatted"
                  value={getFormattedDateTime(video.updateDate)}
                  disabled={true}
                />
              </FormField>
              <FormField classes="utv-formfield-action">
                <SubmitButton
                  title={utvJSData.localization.saveVideo}
                />
                <CancelButton
                  title={utvJSData.localization.cancel}
                  onClick={() => changeView()}
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
    </>
  }
}

export default VideoEditTabView;
