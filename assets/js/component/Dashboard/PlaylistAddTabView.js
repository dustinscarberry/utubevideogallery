import React from 'react';
import Card from '../shared/Card';
import Columns from '../shared/Columns';
import Column from '../shared/Column';
import SectionHeader from '../shared/SectionHeader';
import Breadcrumbs from '../shared/Breadcrumbs';
import Form from '../shared/Form';
import FormField from '../shared/FormField';
import Label from '../shared/Label';
import FieldHint from '../shared/FieldHint';
import TextInput from '../shared/TextInput';
import SelectBox from '../shared/SelectBox';
import Toggle from '../shared/Toggle';
import SubmitButton from '../shared/SubmitButton';
import CancelButton from '../shared/CancelButton';
import PlaylistMultiSelect from '../shared/PlaylistMultiSelect';
import PlaylistVideoSelection from '../shared/PlaylistVideoSelection';
import Loader from '../shared/Loader';
import axios from 'axios';
import {
  isValidResponse,
  isErrorResponse,
  getErrorMessage
} from '../shared/service/shared';

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

    this.changeValue = this.changeValue.bind(this);
    this.changeCheckboxValue = this.changeCheckboxValue.bind(this);
    this.changePlaylistURL = this.changePlaylistURL.bind(this);
    this.changeVideoTitle = this.changeVideoTitle.bind(this);
    this.toggleVideoSelection = this.toggleVideoSelection.bind(this);
    this.toggleAllVideosSelection = this.toggleAllVideosSelection.bind(this);
    this.addPlaylist = this.addPlaylist.bind(this);
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
    const rsp = await axios.get(
      '/wp-json/utubevideogallery/v1/albums',
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (isValidResponse(rsp))
    {
      const data = rsp.data.data;

      const albums = data.map(album =>
      {
        return {
          name: album.title,
          value: album.id
        };
      });

      //add blank entry to list
      albums.unshift({name: '', value: ''});

      this.setState({albums});
    }
    else if (isErrorResponse(rsp))
      this.props.setFeedbackMessage(getErrorMessage(rsp), 'error');
  }

  //load playlist items from given url
  async loadPlaylistVideos()
  {
    //load remote playlist data
    let remoteVideos = undefined;

    if (this.state.source == 'youtube')
      remoteVideos = await axios.get(
        '/wp-json/utubevideogallery/v1/youtubeplaylists/'
        + this.state.sourceID,
        {
          headers: {'X-WP-Nonce': utvJSData.restNonce}
        }
      );
    else if (this.state.source == 'vimeo')
      remoteVideos = await axios.get(
        '/wp-json/utubevideogallery/v1/vimeoplaylists/'
        + this.state.sourceID,
        {
          headers: {'X-WP-Nonce': utvJSData.restNonce}
        }
      );

    if (isValidResponse(remoteVideos))
    {
      let remoteData = remoteVideos.data.data;

      //augment remote videos data
      remoteData.videos = remoteData.videos.map((remoteVideo) =>
      {
        remoteVideo.selected = true;
        return remoteVideo;
      });

      this.setState({
        playlistTitle: remoteData.title,
        playlistVideos: remoteData.videos,
        playlistLoading: false
      });
    }
    else if (isErrorResponse(remoteVideos))
      this.props.setFeedbackMessage(getErrorMessage(remoteVideos), 'error');
  }

  changeValue(event)
  {
    this.setState({[event.target.name]: event.target.value});
  }

  changeCheckboxValue(event)
  {
    this.setState({[event.target.name]: !this.state[event.target.name]});
  }

  changeVideoTitle(dataIndex, event)
  {
    const { playlistVideos } = this.state;
    playlistVideos[dataIndex].title = event.target.value;

    this.setState({playlistVideos});
  }

  changePlaylistURL(event)
  {
    const url = event.target.value;
    this.setState({url});

    if (url)
    {
      const matches = url.match(/^.*?(youtube|vimeo).*?(?:list=|album\/)(.*?)(?:&|$)/);

      if (matches && matches.length == 3)
        this.setState({
          source: matches[1],
          sourceID: matches[2]
        });
    }
  }

  //toggle playlist video selection
  toggleVideoSelection(dataIndex)
  {
    let { playlistVideos } = this.state;
    playlistVideos[dataIndex].selected = !playlistVideos[dataIndex].selected;

    this.setState({playlistVideos});
  }

  //flip state of all videos to selected or not selected
  toggleAllVideosSelection(toggleAll)
  {
    let { playlistVideos } = this.state;
    const selected = toggleAll ? true : false;

    playlistVideos = playlistVideos.map(video => {
      video.selected = selected;
      return video;
    });

    this.setState({playlistVideos});
  }

  //add new playlist to database
  async addPlaylist()
  {
    //set loading
    this.setState({loading: true});

    //save base playlist
    const basePlaylist = await this.addPlaylistData();

    if (isValidResponse(basePlaylist))
    {
      //get playlist id
      const id = basePlaylist.data.data.id;

      //save playlist videos
      await this.addPlaylistVideoData(id);

      this.props.setFeedbackMessage(utvJSData.localization.feedbackPlaylistAdded, 'success');
    }
    else if (isErrorResponse(basePlaylist))
      this.props.setFeedbackMessage(getErrorMessage(basePlaylist), 'error');

    this.props.changeView();
  }

  async addPlaylistData()
  {
    //add base playlist data
    return await axios.post(
      '/wp-json/utubevideogallery/v1/playlists',
      {
        title: this.state.playlistTitle,
        source: this.state.source,
        sourceID: this.state.sourceID,
        videoQuality: this.state.videoQuality,
        showControls: this.state.showControls,
        albumID: this.state.album
      },
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );
  }

  async addPlaylistVideoData(playlistID)
  {
    //create, update, or delete playlist videos based on sync method
    for (let video of this.state.playlistVideos)
    {
      //create video
      if (video.selected)
      {
        let rsp = await axios.post(
          '/wp-json/utubevideogallery/v1/videos',
          {
            sourceID: video.sourceID,
            title: video.title,
            quality: this.state.videoQuality,
            controls: this.state.showControls,
            source: this.state.source,
            albumID: this.state.album,
            playlistID: playlistID
          },
          {
            headers: {'X-WP-Nonce': utvJSData.restNonce}
          }
        );

        //update status about what video is being saved
        this.props.setFeedbackMessage(
          utvJSData.localization.feedbackVideoPartial
          + ' ['
          + video.title
          + '] '
          + utvJSData.localization.feedbackAddedPartial,
          'success'
        );
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
    if (this.state.playlistLoading
      && this.state.url
      && this.state.url != ''
    )
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
