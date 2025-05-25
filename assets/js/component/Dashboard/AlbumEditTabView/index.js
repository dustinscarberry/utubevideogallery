import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
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
import TextInput from 'component/shared/TextInput';
import SelectBox from 'component/shared/SelectBox';
import SubmitButton from 'component/shared/SubmitButton';
import CancelButton from 'component/shared/CancelButton';
import Loader from 'component/shared/Loader';
import AlbumThumbnailSelection from './AlbumThumbnailSelection';

class AlbumEditTabView extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      album: {
        thumbnail: undefined,
        title: '',
        videoSorting: undefined,
        updateDate: undefined,
        gallery: undefined
      },
      supportData: {
        galleries: undefined,
        thumbnails: undefined
      },
      isLoading: true
    };
  }

  async componentDidMount() {
    // load api data
    await Promise.all([
      this.loadData(),
      this.loadGalleries(),
      this.loadThumbnails()
    ]);
    this.setState({isLoading: false});
  }

  loadData = async () => {
    const { currentViewID, setFeedbackMessage } = this.props;

    const apiData = await logic.fetchAlbum(currentViewID);

    if (apiHelper.isValidResponse(apiData)) {
      const data = apiData.data.data;
      this.setState({
        album: {
          thumbnail: data.thumbnail,
          title: data.title,
          videoSorting: data.sortDirection,
          updateDate: data.updateDate,
          gallery: data.galleryID
        }
      });
    } else if (apiHelper.isErrorResponse(apiData))
      setFeedbackMessage(apiHelper.getErrorMessage(apiData), 'error');
  }

  loadGalleries = async () => {
    const apiData = await logic.fetchGalleries();

    if (apiHelper.isValidResponse(apiData)) {
      const galleries = logic.parseGalleriesData(apiData.data.data);
      const supportData = cloneDeep(this.state.supportData);
      supportData.galleries = galleries;
      this.setState({supportData});
    }
  }

  loadThumbnails = async () => {
    const { currentViewID, setFeedbackMessage } = this.props;

    const apiData = await logic.fetchThumbnails(currentViewID);

    if (apiHelper.isValidResponse(apiData)) {
      const thumbnails = logic.parseThumbnailsData(apiData.data.data);
      const supportData = cloneDeep(this.state.supportData);
      supportData.thumbnails = thumbnails;
      this.setState({supportData});
    } else if (apiHelper.isErrorResponse(apiData))
      setFeedbackMessage('Loading album thumbnails failed', 'error');
  }

  saveAlbum = async () => {
    const { currentViewID, changeView, setFeedbackMessage } = this.props;
    const { album } = this.state;

    // clean thumbnail url
    let cleanedThumbnail = logic.getCleanThumbnail(album.thumbnail);

    // update album
    const rsp = await logic.updateAlbum(currentViewID, album, cleanedThumbnail);

    if (apiHelper.isValidResponse(rsp)) {
      changeView();
      setFeedbackMessage(utvJSData.localization.feedbackAlbumSaved);
    } else if (apiHelper.isErrorResponse(rsp))
      setFeedbackMessage(apiHelper.getErrorMessage(rsp), 'error');
  }

  handleUpdateField = (e) => {
    const album = cloneDeep(this.state.album);
    album[e.target.name] = e.target.value;
    this.setState({album});
  }

  handleUpdateThumbnailField = (thumbnail) => {
    if (thumbnail) {
      const album = cloneDeep(this.state.album);
      album.thumbnail = thumbnail;
      this.setState({album});
    }
  }

  render() {
    const { album, supportData, isLoading } = this.state;
    const { changeGallery, changeAlbum, changeView } = this.props;

    if (isLoading) return <Loader/>

    return <>
      <Breadcrumbs
        crumbs={[{
          text: utvJSData.localization.galleries,
          onClick: () => changeGallery()
        }, {
          text: this.props.selectedGalleryTitle,
          onClick: () => changeAlbum()
        }]}
      />
      <Columns>
        <Column className="utv-left-one-thirds-column">
          <Card>
            <SectionHeader text={utvJSData.localization.editAlbum}/>
            <Form
              submit={this.saveAlbum}
              errorclass="utv-invalid-feedback"
            >
              <FormField>
                <Label text={utvJSData.localization.title}/>
                <TextInput
                  name="title"
                  value={album.title}
                  onChange={this.handleUpdateField}
                  required={true}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.gallery}/>
                <SelectBox
                  name="gallery"
                  value={album.gallery}
                  onChange={this.handleUpdateField}
                  choices={supportData.galleries}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.videoSorting}/>
                <SelectBox
                  name="videoSorting"
                  value={album.videoSorting}
                  onChange={this.handleUpdateField}
                  choices={[
                    {name: utvJSData.localization.ascending, value: 'asc'},
                    {name: utvJSData.localization.descending, value: 'desc'}
                  ]}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.lastUpdated}/>
                <TextInput
                  name="updateDate"
                  value={getFormattedDateTime(album.updateDate)}
                  disabled={true}
                />
              </FormField>
              <FormField classes="utv-formfield-action">
                <SubmitButton
                  title={utvJSData.localization.saveAlbum}
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
            <SectionHeader text={utvJSData.localization.albumThumbnail}/>
            <AlbumThumbnailSelection
              currentThumbnail={album.thumbnail}
              thumbnails={supportData.thumbnails}
              updateThumbnail={this.handleUpdateThumbnailField}
            />
          </Card>
        </Column>
      </Columns>
    </>
  }
}

export default AlbumEditTabView;
