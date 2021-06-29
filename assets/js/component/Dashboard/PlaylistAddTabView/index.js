import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
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
        url: '',
        showControls: false,
        source: undefined,
        sourceID: undefined,
        playlistTitle: '',
        playlistVideos: [],
        album: undefined
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
    const { source, sourceID } = this.state.playlist;
    const { setFeedbackMessage } = this.props;

    // fetch remote playlist data
    let apiData = await logic.fetchRemotePlaylist(source, sourceID);

    if (apiHelper.isValidResponse(apiData)) {
      // augment remote videos data
      let remoteVideos = apiData.data.data;
      remoteVideos = logic.parseRemotePlaylistData(remoteVideos);

      const playlist = cloneDeep(this.state.playlist);
      playlist.playlistTitle = remoteVideos.title;
      playlist.playlistVideos = remoteVideos.videos;
      this.setState({playlist: playlist, playlistLoading: false});
    } else if (apiHelper.isErrorResponse(apiData))
      setFeedbackMessage(apiHelper.getErrorMessage(apiData), 'error');
  }

  // add new playlist
  addPlaylist = async () => {
    const { playlist } = this.state;
    const { changeView, setFeedbackMessage } = this.props;

    this.setState({isLoading: true});

    // save base playlist
    const basePlaylist = await logic.createPlaylist(playlist);

    if (apiHelper.isValidResponse(basePlaylist)) {
      // get playlist id
      const data = basePlaylist.data.data;
      const playlistID = data.id;

      // save playlist videos
      await this.addPlaylistVideoData(playlistID);

      setFeedbackMessage(utvJSData.localization.feedbackPlaylistAdded);
    }
    else if (apiHelper.isErrorResponse(basePlaylist))
      setFeedbackMessage(apiHelper.getErrorMessage(basePlaylist), 'error');

    changeView();
  }

  // add each playlist video
  addPlaylistVideoData = async (playlistID) =>  {
    const { playlist } = this.state;
    const { setFeedbackMessage } = this.props;

    // add all videos that are selected
    for (const video of playlist.playlistVideos) {
      // create video if selected
      if (video.selected) {
        await logic.createVideo(playlistID, video, playlist);
        setFeedbackMessage(logic.getVideoCreateMessage(video.title));
      }
    }
  }

  // update field
  handleUpdateField = (e) => {
    const playlist = cloneDeep(this.state.playlist);
    playlist[e.target.name] = e.target.value;
    this.setState({playlist});
  }

  // update toggle field
  handleUpdateToggleField = (e) => {
    const playlist = cloneDeep(this.state.playlist);
    playlist[e.target.name] = !playlist[e.target.name];
    this.setState({playlist});
  }

  // update playlist video title
  handleUpdateVideoTitle = (dataIndex, e) => {
    const playlist = cloneDeep(this.state.playlist);
    playlist.playlistVideos[dataIndex].title = e.target.value;
    this.setState({playlist});
  }

  // update playlist url
  handleUpdatePlaylistURL = (e) => {
    const playlist = cloneDeep(this.state.playlist);
    playlist.url = e.target.value;
    this.setState({playlist});

    if (e.target.value) {
      const urlParts = logic.parsePlaylistURL(e.target.value);

      if (urlParts) {
        playlist.source = urlParts.source;
        playlist.sourceID = urlParts.sourceID;
        this.setState({playlist});
      }
    }
  }

  // toggle playlist video selection
  toggleVideoSelection = (dataIndex) => {
    const playlist = cloneDeep(this.state.playlist);
    playlist.playlistVideos[dataIndex].selected = !playlist.playlistVideos[dataIndex].selected;
    this.setState({playlist});
  }

  // toggle selected state of all playlist videos
  toggleAllVideosSelection = (toggleAll) => {
    const playlist = cloneDeep(this.state.playlist);

    playlist.playlistVideos = playlist.playlistVideos.map(video => {
      video.selected = toggleAll;
      return video;
    });

    this.setState({playlist});
  }

  render() {
    const { isLoading, playlist, supportData } = this.state;
    const { changeView } = this.props;

    if (isLoading) return <Loader/>

    // show playlist videos or loader
    let playlistNode = undefined;
    if (logic.isPlaylistLoading(this.state))
      playlistNode = <Loader/>;
    else
      playlistNode = <PlaylistVideoSelection
        videos={playlist.playlistVideos}
        toggleVideoSelection={this.toggleVideoSelection}
        changeVideoTitle={this.handleUpdateVideoTitle}
      />;

    return <>
      <Breadcrumbs
        crumbs={[{
          text: utvJSData.localization.savedPlaylists,
          onClick: () => changeView()
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
                  value={playlist.url}
                  onChange={this.handleUpdatePlaylistURL}
                  required={true}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.title}/>
                <TextInput
                  name="title"
                  value={playlist.playlistTitle}
                  disabled={true}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.album}/>
                <SelectBox
                  name="album"
                  value={playlist.album}
                  onChange={this.handleUpdateField}
                  choices={supportData.albums}
                  required={true}
                  blankChoice
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.controls}/>
                <Toggle
                  name="showControls"
                  value={playlist.showControls}
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
                  onClick={() => changeView()}
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
              videos={playlist.playlistVideos}
            />
            {playlistNode}
          </Card>
        </Column>
      </Columns>
    </>
  }
}

export default PlaylistAddTabView;
