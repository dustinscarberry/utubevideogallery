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
import Button from '../shared/Button';
import SubmitButton from '../shared/SubmitButton';
import PlaylistVideoSelection from '../shared/PlaylistVideoSelection';
import Loader from '../shared/Loader';
import axios from 'axios';

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

    this.changeValue = this.changeValue.bind(this);
    this.changeCheckboxValue = this.changeCheckboxValue.bind(this);
    this.changeVideoTitle = this.changeVideoTitle.bind(this);
    this.toggleVideoSelection = this.toggleVideoSelection.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
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
    const rsp = await axios.get(
      '/wp-json/utubevideogallery/v1/playlists/'
      + this.props.currentViewID,
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (rsp.status == 200 && !rsp.data.error)
    {
      const data = rsp.data.data;

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
  }

  async loadPlaylistVideos()
  {
    //load remote playlist data
    const remoteVideos = await axios.get(
      '/wp-json/utubevideogallery/v1/youtubeplaylists/'
      + this.state.sourceID,
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    //load local videos already in album
    const localVideos = await axios.get(
      '/wp-json/utubevideogallery/v1/albums/'
      + this.state.albumID
      + '/videos',
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (
      remoteVideos.status == 200
      && !remoteVideos.data.error
      && localVideos.status == 200
      && !localVideos.data.error
    )
    {
      let remoteData = remoteVideos.data.data;
      let localData = localVideos.data.data;

      //augment remote videos data
      remoteData.videos = remoteData.videos.map((remoteVideo) =>
      {
        remoteVideo.selected = false;
        remoteVideo.localID = undefined;

        //determine if remote video already synced
        for (let localVideo of localData)
        {
          if (
            remoteVideo.sourceID == localVideo.url
            && this.props.currentViewID == localVideo.playlistID
          )
          {
            remoteVideo.selected = true;
            remoteVideo.localID = localVideo.id;
            break;
          }
        }

        return remoteVideo;
      });

      this.setState({
        playlistTitle: remoteData.title,
        playlistVideos: remoteData.videos,
        playlistLoading: false
      });
    }
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
    let playlistVideos = this.state.playlistVideos;
    playlistVideos[dataIndex].title = event.target.value;

    this.setState({playlistVideos});
  }

  toggleVideoSelection(dataIndex)
  {
    //flip state of video selected
    let { playlistVideos } = this.state;
    playlistVideos[dataIndex].selected = !playlistVideos[dataIndex].selected;

    this.setState({playlistVideos});
  }

  async savePlaylist()
  {
    //set loading
    this.setState({loading: true});

    //save base playlist
    await this.savePlaylistData();

    //save playlist videos
    await this.savePlaylistVideoData();

    this.props.changeView(undefined);
    this.props.setFeedbackMessage('Playlist synced / saved', 'success');
  }

  async savePlaylistData()
  {
    //save base playlist data
    const playlistRsp = await axios.patch(
      '/wp-json/utubevideogallery/v1/playlists/'
      + this.props.currentViewID,
      {
        videoQuality: this.state.videoQuality,
        showControls: this.state.showControls
      },
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );
  }

  async savePlaylistVideoData()
  {
    //create, update, or delete playlist videos based on sync method
    for (let video of this.state.playlistVideos)
    {
      if (this.state.syncMethod == 'syncSelected')
      {
        //update video
        if (video.selected && video.localID)
        {
          let rsp = await axios.patch(
            '/wp-json/utubevideogallery/v1/videos/'
            + video.localID,
            {
              title: video.title,
              quality: this.state.videoQuality,
              controls: this.state.showControls
            },
            {
              headers: {'X-WP-Nonce': utvJSData.restNonce}
            }
          );
        }
        //create video
        else if (video.selected && !video.localID)
        {
          let rsp = await axios.post(
            '/wp-json/utubevideogallery/v1/videos',
            {
              urlKey: video.sourceID,
              title: video.title,
              quality: this.state.videoQuality,
              controls: this.state.showControls,
              source: this.state.source,
              albumID: this.state.albumID,
              playlistID: this.props.currentViewID
            },
            {
              headers: {'X-WP-Nonce': utvJSData.restNonce}
            }
          );
        }
        //delete video
        else if (!video.selected && video.localID)
        {
          let rsp = await axios.delete(
            '/wp-json/utubevideogallery/v1/videos/'
            + video.localID,
            {
              headers: {'X-WP-Nonce': utvJSData.restNonce}
            }
          );
        }
      }
      else if (this.state.syncMethod == 'syncNew')
      {
        //create video
        if (!video.localID)
        {
          let rsp = await axios.post(
            '/wp-json/utubevideogallery/v1/videos',
            {
              urlKey: video.sourceID,
              title: video.title,
              quality: this.state.videoQuality,
              controls: this.state.showControls,
              source: this.state.source,
              albumID: this.state.albumID,
              playlistID: this.props.currentViewID
            },
            {
              headers: {'X-WP-Nonce': utvJSData.restNonce}
            }
          );
        }
      }
      else if (this.state.syncMethod == 'syncAll')
      {
        //update video
        if (video.localID)
        {
          let rsp = await axios.patch(
            '/wp-json/utubevideogallery/v1/videos/'
            + video.localID,
            {
              title: video.title,
              quality: this.state.videoQuality,
              controls: this.state.showControls
            },
            {
              headers: {'X-WP-Nonce': utvJSData.restNonce}
            }
          );
        }
        //create video
        else
        {
          let rsp = await axios.post(
            '/wp-json/utubevideogallery/v1/videos',
            {
              urlKey: video.sourceID,
              title: video.title,
              quality: this.state.videoQuality,
              controls: this.state.showControls,
              source: this.state.source,
              albumID: this.state.albumID,
              playlistID: this.props.currentViewID
            },
            {
              headers: {'X-WP-Nonce': utvJSData.restNonce}
            }
          );
        }
      }
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

    const updateDate = new Date(this.state.updateDate * 1000);
    const updateDateFormatted = updateDate.getFullYear()
      + '/'
      + (updateDate.getMonth() + 1)
      + '/'
      + updateDate.getDate();

    let source = undefined;
    if (this.state.source == 'youtube')
      source = 'YouTube';
    else if (source == 'vimeo')
      source = 'Vimeo';

    return (
      <div>
        <Breadcrumbs
          crumbs={[
            {
              text: 'Playlists',
              onClick: () => this.props.changeView(undefined)
            },
            {text: 'Playlist Name'}
          ]}
        />
        <Columns>
          <Column className="utv-left-one-thirds-column">
            <Card>
              <SectionHeader text="Edit / Sync Playlist"/>
              <Form
                submit={this.savePlaylist}
                errorclass="utv-invalid-feedback"
              >
                <FormField>
                  <Label text="Title"/>
                  <TextInput
                    name="title"
                    value={this.state.title}
                    disabled={true}
                  />
                </FormField>
                <FormField>
                  <Label text="Source"/>
                  <TextInput
                    name="source"
                    value={source}
                    disabled={true}
                  />
                </FormField>
                <FormField>
                  <Label text="Source ID"/>
                  <TextInput
                    name="sourceID"
                    value={this.state.sourceID}
                    disabled={true}
                  />
                </FormField>
                <FormField>
                  <Label text="Album"/>
                  <TextInput
                    name="albumName"
                    value={this.state.albumName}
                    disabled={true}
                  />
                </FormField>
                <FormField>
                  <Label text="Video Quality"/>
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
                  <Label text="Controls"/>
                  <Toggle
                    name="showControls"
                    value={this.state.showControls}
                    onChange={this.changeCheckboxValue}
                  />
                  <FieldHint text="Visible player controls"/>
                </FormField>
                <FormField>
                  <Label text="Last Updated"/>
                  <TextInput
                    name="updateDate"
                    value={updateDateFormatted}
                    disabled={true}
                  />
                </FormField>
                <FormField>
                  <Label text="Sync Method"/>
                  <SelectBox
                    name="syncMethod"
                    value={this.state.syncMethod}
                    onChange={this.changeValue}
                    data={[
                      {name: 'Sync Selected', value: 'syncSelected'},
                      {name: 'Sync New', value: 'syncNew'},
                      {name: 'Sync All', value: 'syncAll'}
                    ]}
                  />
                </FormField>
                <FormField classes="utv-formfield-action">
                  <SubmitButton
                    title="Sync / Save Changes"
                    classes="button-primary"
                  />
                  <Button
                    title="Cancel"
                    classes="utv-cancel"
                    onClick={() => this.props.changeView(undefined)}
                  />
                </FormField>
              </Form>
            </Card>
          </Column>
          <Column className="utv-right-two-thirds-column">
            <Card>
              <SectionHeader text="Playlist Items"/>
              {playlistNode}
            </Card>
          </Column>
        </Columns>
      </div>
    );
  }
}

export default PlaylistEditTabView;
