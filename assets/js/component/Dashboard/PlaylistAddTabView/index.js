import React from 'react';
import logic from './logic';
import apiHelper from 'helpers/api-helpers';

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
import PlaylistMultiSelect from 'component/shared/PlaylistMultiSelect';
import PlaylistVideoSelection from 'component/shared/PlaylistVideoSelection';
import Loader from 'component/shared/Loader';

class PlaylistAddTabView extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      playlist: {
        url: undefined,
        videoQuality: 'hd1080',
        showControls: false,
        source: undefined,
        sourceID: undefined,
        playlistTitle: undefined,
        playlistVideos: []
      },
      supportData: {
        albums: []
      },
      playlistLoading: true,
      isLoading: true
    };
  }

  async componentDidMount() {
    // load albums selection
    await this.loadAlbums();
    this.setState({isLoading: false});
  }

  componentDidUpdate(nextProps, nextState) {
    // load playlist if url changes
    if (this.state.playlist.sourceID != nextState.playlist.sourceID)
      this.loadPlaylistVideos();
  }

  // load album list for selectbox
  loadAlbums = async () => {
    const { setFeedbackMessage } = this.props;

    const rsp = await logic.fetchAlbums();

    if (apiHelper.isValidResponse(rsp)) {
      const supportData = cloneDeep(this.state.supportData);
      supportData.albums = logic.parseAlbumsData(rsp.data.data);
      this.setState({supportData});
    } else if (apiHelper.isErrorResponse(rsp))
      setFeedbackMessage(apiHelper.getErrorMessage(rsp), 'error');
  }

  // load remote playlist
  loadPlaylistVideos = async () => {
    const { source, sourceID } = this.state;
    const { setFeedbackMessage } = this.props;

    //fetch remote playlist data
    let remoteVideos = await logic.fetchRemotePlaylist(source, sourceID);

    if (apiHelper.isValidResponse(remoteVideos)) {
      // augment remote videos data
      remoteVideos = apiHelper.getAPIData(remoteVideos);
      remoteVideos = logic.parseRemotePlaylistData(remoteVideos);

      this.setState({
        playlistTitle: remoteVideos.title,
        playlistVideos: remoteVideos.videos,
        playlistLoading: false
      });
    } else if (apiHelper.isErrorResponse(remoteVideos))
      setFeedbackMessage(apiHelper.getErrorMessage(remoteVideos), 'error');
  }

  // add new playlist
  addPlaylist = async () => {
    this.setState({isLoading: true});

    // save base playlist
    const basePlaylist = await logic.createPlaylist(this.state);

    if (apiHelper.isValidResponse(basePlaylist)) {
      // get playlist id
      let playlistID = apiHelper.getAPIData(basePlaylist);
      playlistID = playlistID.id;

      // save playlist videos
      await this.addPlaylistVideoData(playlistID);

      this.props.setFeedbackMessage(utvJSData.localization.feedbackPlaylistAdded);
    }
    else if (apiHelper.isErrorResponse(basePlaylist))
      this.props.setFeedbackMessage(apiHelper.getErrorMessage(basePlaylist), 'error');

    this.props.changeView();
  }

  // add each playlist video
  addPlaylistVideoData = async (playlistID) =>  {
    // create all videos that are selected
    for (let video of this.state.playlistVideos) {
      if (video.selected) {
        //create video
        const rsp = await logic.createVideo(
          video.sourceID,
          video.title,
          playlistID,
          this.state
        );

        // feedback of video creation
        this.props.setFeedbackMessage(logic.getVideoCreateMessage(video.title));
      }
    }
  }

  handleUpdateField = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  handleUpdateToggleField = (e) => {
    this.setState({[e.target.name]: !this.state[e.target.name]});
  }

  handleUpdateVideoTitle = (dataIndex, e) => {
    const { playlistVideos } = this.state;
    playlistVideos[dataIndex].title = e.target.value;
    this.setState({playlistVideos});
  }

  handleUpdatePlaylistURL = (e) => {
    const url = e.target.value;
    this.setState({url});

    if (url) {
      const urlParts = logic.parsePlaylistURL(url);

      if (urlParts)
        this.setState(urlParts);
    }
  }

  // toggle playlist video selection
  toggleVideoSelection = (dataIndex) => {
    let { playlistVideos } = this.state;
    playlistVideos[dataIndex].selected = !playlistVideos[dataIndex].selected;

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

    // show playlist videos or loader
    let playlistNode = undefined;
    if (logic.isPlaylistLoading(this.state))
      playlistNode = <Loader/>;
    else
      playlistNode = <PlaylistVideoSelection
        videos={this.state.playlistVideos}
        toggleVideoSelection={this.toggleVideoSelection}
        changeVideoTitle={this.handleUpdateVideoTitle}
      />;

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
            <SectionHeader text={utvJSData.localization.addPlaylist}/>
            <Form
              submit={this.addPlaylist}
              errorclass="utv-invalid-feedback"
            >
              <FormField>
                <Label text={utvJSData.localization.url}/>
                <TextInput
                  name="url"
                  value={this.state.url}
                  onChange={this.handleUpdatePlaylistURL}
                  required={true}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.title}/>
                <TextInput
                  name="title"
                  value={this.state.playlistTitle}
                  disabled={true}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.album}/>
                <SelectBox
                  name="album"
                  value={this.state.album}
                  onChange={this.handleUpdateField}
                  choices={this.state.albums}
                  required={true}
                  blankEntry={true}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.quality}/>
                <SelectBox
                  name="videoQuality"
                  value={this.state.videoQuality}
                  onChange={this.handleUpdateField}
                  choices={[
                    {name: '1080p', value: 'hd1080'},
                    {name: '720p', value: 'hd720'},
                    {name: '480p', value: 'large'}
                  ]}
                  required={true}
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
              <FormField classes="utv-formfield-action">
                <SubmitButton
                  title={utvJSData.localization.addPlaylist}
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
            {playlistNode}
          </Card>
        </Column>
      </Columns>
    </>
  }
}

export default PlaylistAddTabView;
