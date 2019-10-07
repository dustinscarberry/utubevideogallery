import React from 'react';
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
import Toggle from '../../shared/Toggle';
import SelectBox from '../../shared/SelectBox';
import NumberInput from '../../shared/NumberInput';
import TextBoxInput from '../../shared/TextBoxInput';
import SubmitButton from '../../shared/SubmitButton';
import CancelButton from '../../shared/CancelButton';
import Loader from '../../shared/Loader';

class VideoEditTabView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      thumbnail: undefined,
      source: undefined,
      sourceID: undefined,
      title: undefined,
      description: undefined,
      quality: undefined,
      showControls: undefined,
      startTime: undefined,
      endTime: undefined,
      updateDate: undefined,
      album: undefined,
      albums: undefined,
      loading: true
    };
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
    //get video
    const apiData = await actions.fetchVideo(this.props.currentViewID);

    if (utility.isValidResponse(apiData))
    {
      const data = utility.getAPIData(apiData);

      this.setState({
        thumbnail: data.thumbnail,
        source: data.source,
        sourceID: data.sourceID,
        title: data.title,
        description: data.description ? data.description : undefined,
        quality: data.quality,
        showControls: data.showControls == 1 ? true : false,
        startTime: data.startTime,
        endTime: data.endTime,
        updateDate: data.updateDate,
        album: data.albumID,
        loading: false
      });
    }
    else if (utility.isErrorResponse(apiData))
      this.props.setFeedbackMessage(utility.getErrorMessage(apiData), 'error');
  }

  async loadAlbums()
  {
    //get albums
    const apiData = await actions.fetchGalleryAlbums(this.props.selectedGallery);

    if (utility.isValidResponse(apiData))
    {
      const data = utility.getAPIData(apiData);
      const albums = actions.parseAlbumsData(data);
      this.setState({albums});
    }
    else if (utility.isErrorResponse(apiData))
      this.props.setFeedbackMessage(utility.getErrorMessage(apiData), 'error');
  }

  changeValue = (event) =>
  {
    this.setState({[event.target.name]: event.target.value});
  }

  changeCheckboxValue = (event) =>
  {
    this.setState({[event.target.name]: !this.state[event.target.name]});
  }

  saveVideo = async() =>
  {
    //update video
    const rsp = await actions.updateVideo(this.props.currentViewID, this.state);

    if (utility.isValidResponse(rsp))
    {
      this.props.changeView();
      this.props.setFeedbackMessage(utvJSData.localization.feedbackVideoSaved);
    }
    else if (utility.isErrorResponse(rsp))
      this.props.setFeedbackMessage(utility.getErrorMessage(rsp), 'error');
  }

  render()
  {
    const updateDateFormatted = utility.getFormattedDateTime(this.state.updateDate);

    //show loader while form is loading
    if (this.state.loading)
      return <Loader/>;

    return (
      <div>
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
                submit={this.saveVideo}
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
                    onChange={this.changeValue}
                    required={true}
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
                  <Label text={utvJSData.localization.album}/>
                  <SelectBox
                    name="album"
                    value={this.state.album}
                    onChange={this.changeValue}
                    data={this.state.albums}
                  />
                </FormField>
                <FormField>
                  <Label text={utvJSData.localization.quality}/>
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
                <FormField>
                  <Label text={utvJSData.localization.lastUpdated}/>
                  <TextInput
                    name="updateDateFormatted"
                    value={updateDateFormatted}
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
      </div>
    );
  }
}

export default VideoEditTabView;
