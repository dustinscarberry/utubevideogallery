import React from 'react';
import logic from './logic';
import apiHelper from 'helpers/api-helpers';
import { getFormattedDateTime } from 'helpers/datetime-helpers';

import Card from 'component/shared/Card';
import Columns from 'component/shared/Columns';
import Column from 'component/shared/Column';
import SectionHeader from 'component/shared/SectionHeader';
import Breadcrumbs from 'component/shared/Breadcrumbs';
import Form from 'component/shared/Form';
import FormField from 'component/shared/FormField';
import Label from 'component/shared/Label';
import FieldHint from 'component/shared/FieldHint';
import TextInput from 'component/shared/TextInput';
import SelectBox from 'component/shared/SelectBox';
import Toggle from 'component/shared/Toggle';
import SubmitButton from 'component/shared/SubmitButton';
import CancelButton from 'component/shared/CancelButton';
import PlaylistLegend from 'component/shared/PlaylistLegend';
import PlaylistMultiSelect from 'component/shared/PlaylistMultiSelect';
import PlaylistVideoSelection from 'component/shared/PlaylistVideoSelection';
import Loader from 'component/shared/Loader';

class PlaylistEditTabView extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      title: undefined,
      source: undefined,
      sourceID: undefined,
      videoQuality: undefined,
      showControls: undefined,
      updateDate: undefined,
      albumID: undefined,
      albumName: undefined,
      syncMethod: 'syncSelected',
      playlistTitle: undefined,
      playlistVideos: [],
      playlistLoading: true,
      isLoading: true
    };
  }

  async componentDidMount() {
    // load api data
    await this.loadPlaylist();
    this.loadPlaylistVideos();
    this.setState({isLoading: false});
  }

  loadPlaylist = async () => {
    const rsp = await logic.fetchPlaylist(this.props.currentViewID);

    if (apiHelper.isValidResponse(rsp)) {
      const data = apiHelper.getAPIData(rsp);

      this.setState({
        title: data.title,
        source: data.source,
        sourceID: data.sourceID,
        videoQuality: data.videoQuality,
        showControls: data.showControls,
        updateDate: data.updateDate,
        albumID: data.albumID,
        albumName: data.albumName
      });
    }
    else if (apiHelper.isErrorResponse(rsp))
      this.props.setFeedbackMessage(apiHelper.getErrorMessage(rsp), 'error');
  }

  loadPlaylistVideos = async () => {
    const { source, sourceID, albumID } = this.state;

    // fetch remote playlist videos
    const remoteVideos = await logic.fetchRemotePlaylist(source, sourceID);

    // fetch local playlist videos already created
    const localVideos = await logic.fetchLocalPlaylistVideos(albumID);

    // check for errors
    if (apiHelper.isErrorResponse(remoteVideos)) {
      this.props.setFeedbackMessage(apiHelper.getErrorMessage(remoteVideos), 'error');
      return;
    }

    if (apiHelper.isErrorResponse(localVideos)) {
      this.props.setFeedbackMessage(apiHelper.getErrorMessage(localVideos), 'error');
      return;
    }

    // if all is good filter playlist data
    const remoteData = remoteVideos.data.data;
    let localData = localVideos.data.data;

    //// TODO: remove this and switch to correct query above instead
    // filter local playlist videos
    localData = localData.filter(localVideo =>
      localVideo.playlistID == this.props.currentViewID
    );

    // combine local and remote playlist videos
    const combinedVideos = logic.combineVideos(localData, remoteData);

    this.setState({
      playlistTitle: remoteData.title,
      playlistVideos: combinedVideos,
      playlistLoading: false
    });
  }

  savePlaylist = async () => {
    const { currentViewID, changeView, setFeedbackMessage } = this.props;

    this.setState({isLoading: true});

    // save base playlist
    await logic.updatePlaylist(currentViewID, this.state);

    // save playlist videos
    await this.savePlaylistVideoData();

    changeView();
    setFeedbackMessage(utvJSData.localization.feedbackPlaylistSynced);
  }

  savePlaylistVideoData = async () => {
    const { currentViewID, setFeedbackMessage } = this.props;
    const { playlistVideos, syncMethod } = this.state;

    // create, update, or delete playlist videos based on sync method
    for (const video of playlistVideos) {
      await logic.syncVideo(syncMethod, currentViewID, video, this.state);
      setFeedbackMessage(logic.getVideoUpdateMessage(video.title));
    }
  }

  handleUpdateField = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  handleUpdateToggleField = (e) => {
    this.setState({[e.target.name]: !this.state[e.target.name]});
  }

  changeVideoTitle = (videoIndex, e) => {
    let { playlistVideos } = this.state;
    playlistVideos[videoIndex].title = e.target.value;
    this.setState({playlistVideos});
  }

  // toggle playlist video selection
  toggleVideoSelection = (videoIndex) => {
    const { playlistVideos } = this.state;
    playlistVideos[videoIndex].selected = !playlistVideos[videoIndex].selected;
    this.setState({playlistVideos});
  }

  // toggle selected state of all playlist videos
  toggleAllVideosSelection = (toggleAll) => {
    let { playlistVideos } = this.state;

    playlistVideos = playlistVideos.map(video => {
      video.selected = toggleAll;
      return video;
    });

    this.setState({playlistVideos});
  }

  render() {
    const { isLoading } = this.state;

    if (isLoading) return <Loader/>

    let playlistNode;
    if (this.state.playlistLoading)
      playlistNode = <Loader/>;
    else
      playlistNode = <PlaylistVideoSelection
        videos={this.state.playlistVideos}
        toggleVideoSelection={this.toggleVideoSelection}
        changeVideoTitle={this.changeVideoTitle}
      />

    return <>
      <Breadcrumbs
        crumbs={[{
          text: utvJSData.localization.savedPlaylists,
          onClick: () => this.props.changeView()
        }]}
      />
      <Columns>
        <Column className="utv-left-one-thirds-column">
          <Card>
            <SectionHeader text={utvJSData.localization.editSyncPlaylist}/>
            <Form
              submit={this.savePlaylist}
              errorclass="utv-invalid-feedback"
            >
              <FormField>
                <Label text={utvJSData.localization.title}/>
                <TextInput
                  name="title"
                  value={this.state.title}
                  disabled={true}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.source}/>
                <TextInput
                  name="source"
                  value={logic.getFormattedSource(this.state.source)}
                  disabled={true}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.album}/>
                <TextInput
                  name="albumName"
                  value={this.state.albumName}
                  disabled={true}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.quality}/>
                <SelectBox
                  name="videoQuality"
                  value={this.state.videoQuality}
                  onChange={this.handleUpdateField}
                  choices={[
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
                  onChange={this.handleUpdateToggleField}
                />
                <FieldHint text={utvJSData.localization.showPlayerControlsHint}/>
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.lastUpdated}/>
                <TextInput
                  name="updateDate"
                  value={getFormattedDateTime(this.state.updateDate)}
                  disabled={true}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.syncMethod}/>
                <SelectBox
                  name="syncMethod"
                  value={this.state.syncMethod}
                  onChange={this.handleUpdateField}
                  choices={[
                    {name: utvJSData.localization.syncSelected, value: 'syncSelected'},
                    {name: utvJSData.localization.syncNew, value: 'syncNew'},
                    {name: utvJSData.localization.syncAll, value: 'syncAll'}
                  ]}
                />
              </FormField>
              <FormField classes="utv-formfield-action">
                <SubmitButton
                  title={utvJSData.localization.syncSaveChanges}
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
          <Card>
            <SectionHeader text={utvJSData.localization.playlistItems}/>
            <PlaylistMultiSelect
              toggleAllVideosSelection={this.toggleAllVideosSelection}
              videos={this.state.playlistVideos}
            />
            <PlaylistLegend/>
            {playlistNode}
          </Card>
        </Column>
      </Columns>
    </>
  }
}

export default PlaylistEditTabView;
