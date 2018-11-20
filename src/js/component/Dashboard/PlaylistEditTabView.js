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
      albumName: undefined,
      playlistTitle: undefined,
      playlistVideos: [],
      playlistLoading: true,
      loading: true
    };

    this.changeValue = this.changeValue.bind(this);
    this.changeCheckboxValue = this.changeCheckboxValue.bind(this);
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
        albumName: data.albumName
      });
    }
  }

  async loadPlaylistVideos()
  {
    const rsp = await axios.get(
      '/wp-json/utubevideogallery/v1/youtubeplaylists/'
      + this.state.sourceID,
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (rsp.status == 200 && !rsp.data.error)
    {
      let data = rsp.data.data;

      data.videos = data.videos.map((video) => {
        video.selected = true;
        return video;
      });

      this.setState({
        playlistTitle: data.title,
        playlistVideos: data.videos,
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

  toggleVideoSelection(dataIndex)
  {
    //flip state of video selected
    let { playlistVideos } = this.state;
    playlistVideos[dataIndex].selected = !playlistVideos[dataIndex].selected;

    this.setState({playlistVideos});
  }

  async savePlaylist()
  {
    //clean thumbnail url before sending
    let cleanedThumbnail = this.state.thumbnail.replace(utvJSData.thumbnailCacheDirectory, '');
    cleanedThumbnail = cleanedThumbnail.replace('.jpg', '');

    const rsp = await axios.patch(
      '/wp-json/utubevideogallery/v1/albums/'
      + this.props.currentViewID,
      {
        title: this.state.title,
        thumbnail: cleanedThumbnail,
        videoSorting: this.state.videoSorting,
        galleryID: this.state.gallery
      },
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (rsp.status == 200 && !rsp.data.error)
    {
      this.props.changeView(undefined);
      this.props.setFeedbackMessage('Album changes saved', 'success');
    }
    else
      this.props.setFeedbackMessage(rsp.data.error.message, 'error');
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
      />

    const updateDate = new Date(this.state.updateDate * 1000);
    const updateDateFormatted = updateDate.getFullYear()
      + '/'
      + (updateDate.getMonth() + 1)
      + '/'
      + updateDate.getDate();

    return (
      <div>
        <Breadcrumbs
          crumbs={[
            {text: 'Playlists', onClick: () => this.props.changeView(undefined)},
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
                    value={this.state.source}
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
                    name="controls"
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
