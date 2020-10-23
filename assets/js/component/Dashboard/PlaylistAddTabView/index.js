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
import PlaylistMultiSelect from '../../shared/PlaylistMultiSelect';
import PlaylistVideoSelection from '../../shared/PlaylistVideoSelection';
import Loader from '../../shared/Loader';

class PlaylistAddTabView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      url: undefined,
      videoQuality: 'hd1080',
      showControls: false,
      source: undefined,
      sourceID: undefined,
      playlistTitle: undefined,
      playlistVideos: [],
      playlistLoading: true,
      loading: true
    };
  }

  //load api data on first load
  async componentDidMount()
  {
    //load albums selection
    await this.loadAlbums();

    //set loading state
    this.setState({loading: false});
  }

  //load playlist if url changes
  componentDidUpdate(nextProps, nextState)
  {
    if (this.state.sourceID != nextState.sourceID)
      this.loadPlaylistVideos();
  }

  //load album list for selectbox
  async loadAlbums()
  {
    const rsp = await actions.fetchAlbums();

    if (utility.isValidResponse(rsp)) {
      const data = utility.getAPIData(rsp);
      const albums = actions.parseAlbumsData(data);
      this.setState({albums});
    } else if (utility.isErrorResponse(rsp))
      this.props.setFeedbackMessage(utility.getErrorMessage(rsp), 'error');
  }

  //load remote playlist
  async loadPlaylistVideos()
  {
    const { source, sourceID } = this.state;

    //fetch remote playlist data
    let remoteVideos = await actions.fetchRemotePlaylist(source, sourceID);

    if (utility.isValidResponse(remoteVideos))
    {
      //augment remote videos data
      remoteVideos = utility.getAPIData(remoteVideos);
      remoteVideos = actions.parseRemotePlaylistData(remoteVideos);

      //add remote videos to state
      this.setState({
        playlistTitle: remoteVideos.title,
        playlistVideos: remoteVideos.videos,
        playlistLoading: false
      });
    }
    else if (utility.isErrorResponse(remoteVideos))
      this.props.setFeedbackMessage(utility.getErrorMessage(remoteVideos), 'error');
  }

  changeValue = (e) =>
  {
    this.setState({[e.target.name]: e.target.value});
  }

  changeCheckboxValue = (e) =>
  {
    this.setState({[e.target.name]: !this.state[e.target.name]});
  }

  changeVideoTitle = (dataIndex, e) =>
  {
    const { playlistVideos } = this.state;
    playlistVideos[dataIndex].title = e.target.value;

    this.setState({playlistVideos});
  }

  changePlaylistURL = (e) =>
  {
    const url = e.target.value;
    this.setState({url});

    if (url) {
      const urlParts = actions.parsePlaylistURL(url);

      if (urlParts)
        this.setState(urlParts);
    }
  }

  //toggle playlist video selection
  toggleVideoSelection = (dataIndex) =>
  {
    let { playlistVideos } = this.state;
    playlistVideos[dataIndex].selected = !playlistVideos[dataIndex].selected;

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

  //add new playlist
  addPlaylist = async() =>
  {
    //set loading
    this.setState({loading: true});

    //save base playlist
    const basePlaylist = await actions.createPlaylist(this.state);

    if (utility.isValidResponse(basePlaylist))
    {
      //get playlist id
      let playlistID = utility.getAPIData(basePlaylist);
      playlistID = playlistID.id;

      //save playlist videos
      await this.addPlaylistVideoData(playlistID);

      this.props.setFeedbackMessage(utvJSData.localization.feedbackPlaylistAdded);
    }
    else if (utility.isErrorResponse(basePlaylist))
      this.props.setFeedbackMessage(utility.getErrorMessage(basePlaylist), 'error');

    this.props.changeView();
  }

  //add each playlist video
  async addPlaylistVideoData(playlistID)
  {
    //create all videos that selected
    for (let video of this.state.playlistVideos) {
      if (video.selected) {
        //create video
        const rsp = await actions.createVideo(
          video.sourceID,
          video.title,
          playlistID,
          this.state
        );

        //feedback of video creation
        this.props.setFeedbackMessage(actions.getVideoCreateMessage(video.title));
      }
    }
  }

  render()
  {
    //show view loader
    if (this.state.loading)
      return <Loader/>;

    //show playlist videos or loader
    let playlistNode = undefined;
    if (actions.isPlaylistLoading(this.state))
      playlistNode = <Loader/>;
    else
      playlistNode = <PlaylistVideoSelection
        videos={this.state.playlistVideos}
        toggleVideoSelection={this.toggleVideoSelection}
        changeVideoTitle={this.changeVideoTitle}
      />;

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
                    onChange={this.changePlaylistURL}
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
                    onChange={this.changeValue}
                    data={this.state.albums}
                    required={true}
                    blankEntry={true}
                  />
                </FormField>
                <FormField>
                  <Label text={utvJSData.localization.quality}/>
                  <SelectBox
                    name="videoQuality"
                    value={this.state.videoQuality}
                    onChange={this.changeValue}
                    data={[
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
                    onChange={this.changeCheckboxValue}
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
      </div>
    );
  }
}

export default PlaylistAddTabView;
