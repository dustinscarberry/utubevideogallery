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
import PlaylistLegend from '../shared/PlaylistLegend';
import PlaylistMultiSelect from '../shared/PlaylistMultiSelect';
import PlaylistVideoSelection from '../shared/PlaylistVideoSelection';
import Loader from '../shared/Loader';
import sharedService from '../../service/SharedService';
import axios from 'axios';
import {
  isValidResponse,
  isErrorResponse,
  getErrorMessage
} from '../shared/service/shared';

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
    const rsp = await axios.get(
      '/wp-json/utubevideogallery/v1/playlists/'
      + this.props.currentViewID,
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (isValidResponse(rsp))
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
    else if (isErrorResponse(rsp))
      this.props.setFeedbackMessage(getErrorMessage(rsp), 'error');
  }

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

    //load local videos already in album
    const localVideos = await axios.get(
      '/wp-json/utubevideogallery/v1/albums/'
      + this.state.albumID
      + '/videos',
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    //check for errors
    if (isErrorResponse(remoteVideos))
    {
      this.props.setFeedbackMessage(getErrorMessage(remoteVideos), 'error');
      return;
    }

    if (isErrorResponse(localVideos))
    {
      this.props.setFeedbackMessage(getErrorMessage(localVideos), 'error');
      return;
    }

    //if all is good filter playlist data
    const remoteData = remoteVideos.data.data;
    let localData = localVideos.data.data;
    let combinedData = {};

    //filter local album videos to just playlist
    localData = localData.filter(localVideo =>
      localVideo.playlistID == this.props.currentViewID
    );

    //add local videos
    for (let localVideo of localData)
    {
      const source = localVideo.sourceID;

      combinedData[source] = {};
      combinedData[source].title = localVideo.title;
      combinedData[source].description = localVideo.description;
      combinedData[source].thumbnail = utvJSData.thumbnailCacheDirectory + localVideo.thumbnail + '.jpg';
      combinedData[source].sourceID = localVideo.sourceID;
      combinedData[source].localID = localVideo.id;
      combinedData[source].selected = true;
      combinedData[source].legend = 'local';
    }

    //add remote videos
    for (let remoteVideo of remoteData.videos)
    {
      const source = remoteVideo.sourceID;

      if (source in combinedData)
      {
        combinedData[source].title = remoteVideo.title;
        combinedData[source].description = remoteVideo.description;
        combinedData[source].legend = 'both';
        combinedData[source].thumbnail = remoteVideo.thumbnail;
      }
      else
      {
        combinedData[source] = {};
        combinedData[source].title = remoteVideo.title;
        combinedData[source].description = remoteVideo.description;
        combinedData[source].thumbnail = remoteVideo.thumbnail;
        combinedData[source].sourceID = remoteVideo.sourceID;
        combinedData[source].localID = undefined;
        combinedData[source].selected = false;
        combinedData[source].legend = 'web';
      }
    }

    //convert object to array
    combinedData = Object.keys(combinedData).map(key => combinedData[key]);

    this.setState({
      playlistTitle: remoteData.title,
      playlistVideos: combinedData,
      playlistLoading: false
    });
  }

  changeValue = (event) =>
  {
    this.setState({[event.target.name]: event.target.value});
  }

  changeCheckboxValue = (event) =>
  {
    this.setState({[event.target.name]: !this.state[event.target.name]});
  }

  changeVideoTitle = (dataIndex, event) =>
  {
    let playlistVideos = this.state.playlistVideos;
    playlistVideos[dataIndex].title = event.target.value;

    this.setState({playlistVideos});
  }

  //flip state of video selected
  toggleVideoSelection = (dataIndex) =>
  {
    const { playlistVideos } = this.state;
    playlistVideos[dataIndex].selected = !playlistVideos[dataIndex].selected;

    this.setState({playlistVideos});
  }

  //flip state of all videos to selected or not selected
  toggleAllVideosSelection = (toggleAll) =>
  {
    let { playlistVideos } = this.state;
    const selected = toggleAll ? true : false;

    playlistVideos = playlistVideos.map(video => {
      video.selected = selected;
      return video;
    });

    this.setState({playlistVideos});
  }

  savePlaylist = async() =>
  {
    //set loading
    this.setState({loading: true});

    //save base playlist
    await this.savePlaylistData();

    //save playlist videos
    await this.savePlaylistVideoData();

    this.props.changeView();
    this.props.setFeedbackMessage(utvJSData.localization.feedbackPlaylistSynced);
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
              description: video.description,
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
              sourceID: video.sourceID,
              title: video.title,
              description: video.description,
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
              sourceID: video.sourceID,
              title: video.title,
              description: video.description,
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
              description: video.description,
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
              sourceID: video.sourceID,
              title: video.title,
              description: video.description,
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

      //update status about what video is being saved
      this.props.setFeedbackMessage(
        utvJSData.localization.feedbackVideoPartial
        + ' ['
        + video.title
        + '] '
        + utvJSData.localization.feedbackUpdatedPartial,
        'success'
      );
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

    const updateDateFormatted = sharedService.getFormattedDateTime(this.state.updateDate);

    let source = undefined;
    if (this.state.source == 'youtube')
      source = 'YouTube';
    else if (this.state.source == 'vimeo')
      source = 'Vimeo';

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
                    value={source}
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
                    value={updateDateFormatted}
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