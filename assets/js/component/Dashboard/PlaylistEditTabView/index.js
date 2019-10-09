import React from 'react';
import actions from './actions';
import utility from '../../shared/utility';
import Card from '../../shared/Card';
import Columns from '../../shared/Columns';
import Column from '../../shared/Column';
import SectionHeader from '../../shared/SectionHeader';
import Breadcrumbs from '../../shared/Breadcrumbs';
import Form from '../../shared/Form';
import FormField from '../../shared/FormField';
import Label from '../../shared/Label';
import FieldHint from '../../shared/FieldHint';
import TextInput from '../../shared/TextInput';
import SelectBox from '../../shared/SelectBox';
import Toggle from '../../shared/Toggle';
import SubmitButton from '../../shared/SubmitButton';
import CancelButton from '../../shared/CancelButton';
import PlaylistLegend from '../../shared/PlaylistLegend';
import PlaylistMultiSelect from '../../shared/PlaylistMultiSelect';
import PlaylistVideoSelection from '../../shared/PlaylistVideoSelection';
import Loader from '../../shared/Loader';

class PlaylistEditTabView extends React.Component
{
  constructor(props)
  {
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
      loading: true
    };
  }

  async componentDidMount()
  {
    //load api data
    await this.loadPlaylist();
    this.loadPlaylistVideos();

    //set loading state
    this.setState({loading: false});
  }

  async loadPlaylist()
  {
    const rsp = await actions.fetchPlaylist(this.props.currentViewID);

    if (utility.isValidResponse(rsp))
    {
      const data = utility.getAPIData(rsp);

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
    else if (utility.isErrorResponse(rsp))
      this.props.setFeedbackMessage(utility.getErrorMessage(rsp), 'error');
  }

  async loadPlaylistVideos()
  {
    const { source, sourceID, albumID } = this.state;

    //fetch remote playlist videos
    const remoteVideos = await actions.fetchRemotePlaylist(source, sourceID);

    //fetch local playlist videos already created
    const localVideos = await actions.fetchLocalPlaylistVideos(albumID);

    //check for errors
    if (utility.isErrorResponse(remoteVideos))
    {
      this.props.setFeedbackMessage(utility.getErrorMessage(remoteVideos), 'error');
      return;
    }

    if (utility.isErrorResponse(localVideos))
    {
      this.props.setFeedbackMessage(utility.getErrorMessage(localVideos), 'error');
      return;
    }

    //if all is good filter playlist data
    const remoteData = utility.getAPIData(remoteVideos);
    let localData = utility.getAPIData(localVideos);

    //// TODO: remove this and switch to correct query above instead
    //filter local playlist videos
    localData = localData.filter(localVideo =>
      localVideo.playlistID == this.props.currentViewID
    );

    //combine local and remote playlist videos
    const combinedVideos = actions.combineVideos(localData, remoteData);

    this.setState({
      playlistTitle: remoteData.title,
      playlistVideos: combinedVideos,
      playlistLoading: false
    });
  }

  changeValue = (e) =>
  {
    this.setState({[e.target.name]: e.target.value});
  }

  changeCheckboxValue = (e) =>
  {
    this.setState({[e.target.name]: !this.state[e.target.name]});
  }

  changeVideoTitle = (videoIndex, e) =>
  {
    let { playlistVideos } = this.state;
    playlistVideos[videoIndex].title = e.target.value;
    this.setState({playlistVideos});
  }

  //toggle playlist video selection
  toggleVideoSelection = (videoIndex) =>
  {
    const { playlistVideos } = this.state;
    playlistVideos[videoIndex].selected = !playlistVideos[videoIndex].selected;
    this.setState({playlistVideos});
  }

  //toggle selected state of all playlist videos
  toggleAllVideosSelection = (toggleAll) =>
  {
    let { playlistVideos } = this.state;

    playlistVideos = playlistVideos.map(video => {
      video.selected = toggleAll;
      return video;
    });

    this.setState({playlistVideos});
  }

  savePlaylist = async() =>
  {
    //set loading
    this.setState({loading: true});

    //save base playlist
    await actions.updatePlaylist(this.props.currentViewID, this.state);

    //save playlist videos
    await this.savePlaylistVideoData();

    this.props.changeView();
    this.props.setFeedbackMessage(utvJSData.localization.feedbackPlaylistSynced);
  }

  async savePlaylistVideoData()
  {
    const { playlistVideos, syncMethod } = this.state;

    //create, update, or delete playlist videos based on sync method
    for (let video of playlistVideos)
    {
      //sync video
      await actions.syncVideo(syncMethod, this.props.currentViewID, video, this.state);

      //user feedback for video created / updated / deleted
      this.props.setFeedbackMessage(actions.getVideoUpdateMessage(video.title));
    }
  }

  render()
  {
    if (this.state.loading)
      return <Loader/>;

    let playlistNode = undefined;
    if (this.state.playlistLoading)
      playlistNode = <Loader/>;
    else
      playlistNode = <PlaylistVideoSelection
        videos={this.state.playlistVideos}
        toggleVideoSelection={this.toggleVideoSelection}
        changeVideoTitle={this.changeVideoTitle}
      />

    return (
      <div>
        <Breadcrumbs
          crumbs={[
            {
              text: utvJSData.localization.savedPlaylists,
              onClick: () => this.props.changeView()
            }
          ]}
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
                    value={actions.getFormattedSource(this.state.source)}
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
                  <Label text={utvJSData.localization.lastUpdated}/>
                  <TextInput
                    name="updateDate"
                    value={utility.getFormattedDateTime(this.state.updateDate)}
                    disabled={true}
                  />
                </FormField>
                <FormField>
                  <Label text={utvJSData.localization.syncMethod}/>
                  <SelectBox
                    name="syncMethod"
                    value={this.state.syncMethod}
                    onChange={this.changeValue}
                    data={[
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
      </div>
    );
  }
}

export default PlaylistEditTabView;
