import React from 'react';
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
import SubmitButton from '../../shared/SubmitButton';
import CancelButton from '../../shared/CancelButton';
import Loader from '../../shared/Loader';
import AlbumThumbnailSelection from './AlbumThumbnailSelection';
import sharedService from '../../../service/SharedService';
import axios from 'axios';
import {
  isValidResponse,
  isErrorResponse,
  getErrorMessage,
  getAPIData
} from '../../shared/service/shared';
import actions from './actions';

class AlbumEditTabView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      thumbnail: undefined,
      title: '',
      videoSorting: undefined,
      updateDate: undefined,
      gallery: undefined,
      galleries: undefined,
      thumbnails: undefined,
      loading: true
    };
  }

  async componentDidMount()
  {
    //load api data
    await Promise.all([
      this.loadData(),
      this.loadGalleries(),
      this.loadThumbnails()
    ]);

    //set loading state
    this.setState({loading: false});
  }

  async loadData()
  {
    const apiData = await actions.fetchAlbum(this.props.currentViewID);

    if (isValidResponse(apiData))
    {
      const data = getAPIData(apiData);

      this.setState({
        thumbnail: data.thumbnail,
        title: data.title,
        videoSorting: data.sortDirection,
        updateDate: data.updateDate,
        gallery: data.galleryID
      });
    }
    else if (isErrorResponse(apiData))
      this.props.setFeedbackMessage(getErrorMessage(apiData), 'error');
  }

  async loadGalleries()
  {
    const apiData = await actions.fetchGalleries();

    if (isValidResponse(apiData))
    {
      const data = getAPIData(apiData);
      const galleries = actions.parseGalleriesData(data);
      this.setState({galleries});
    }
  }

  async loadThumbnails()
  {
    const apiData = await actions.fetchThumbnails(this.props.currentViewID);

    if (isValidResponse(apiData))
    {
      const data = getAPIData(apiData);
      const thumbnails = actions.parseThumbnailsData(data);
      this.setState({thumbnails});
    }
    else if (isErrorResponse(apiData))
      this.props.setFeedbackMessage('Loading album thumbnails failed', 'error');
  }

  changeValue = (event) =>
  {
    this.setState({[event.target.name]: event.target.value});
  }

  changeCheckboxValue = (event) =>
  {
    this.setState({[event.target.name]: !this.state[event.target.name]});
  }

  updateThumbnailValue = (thumbnail) =>
  {
    if (thumbnail)
      this.setState({thumbnail});
  }

  saveAlbum = async() =>
  {
    //clean thumbnail url before sending
    let cleanedThumbnail = actions.getCleanThumbnail(this.state.thumbnail);

    //update album
    const rsp = await actions.updateAlbum(
      this.props.currentViewID,
      this.state.title,
      cleanedThumbnail,
      this.state.videoSorting,
      this.state.gallery
    );

    if (isValidResponse(rsp))
    {
      this.props.changeView();
      this.props.setFeedbackMessage(utvJSData.localization.feedbackAlbumSaved);
    }
    else if (isErrorResponse(rsp))
      this.props.setFeedbackMessage(getErrorMessage(rsp), 'error');
  }

  render()
  {
    const updateDateFormatted = sharedService.getFormattedDateTime(this.state.updateDate);

    if (this.state.loading)
      return <Loader/>;

    return (
      <div>
        <Breadcrumbs
          crumbs={[
            {
              text: utvJSData.localization.galleries,
              onClick: () => this.props.changeGallery()
            },
            {
              text: this.props.selectedGalleryTitle,
              onClick: () => this.props.changeAlbum()
            }
          ]}
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
                    value={this.state.title}
                    onChange={this.changeValue}
                    required={true}
                  />
                </FormField>
                <FormField>
                  <Label text={utvJSData.localization.gallery}/>
                  <SelectBox
                    name="gallery"
                    value={this.state.gallery}
                    onChange={this.changeValue}
                    data={this.state.galleries}
                  />
                </FormField>
                <FormField>
                  <Label text={utvJSData.localization.videoSorting}/>
                  <SelectBox
                    name="videoSorting"
                    value={this.state.videoSorting}
                    onChange={this.changeValue}
                    data={[
                      {name: utvJSData.localization.ascending, value: 'asc'},
                      {name: utvJSData.localization.descending, value: 'desc'}
                    ]}
                  />
                </FormField>
                <FormField>
                  <Label text={utvJSData.localization.lastUpdated}/>
                  <TextInput
                    name="updateDate"
                    value={updateDateFormatted}
                    disabled={true}
                  />
                </FormField>
                <FormField classes="utv-formfield-action">
                  <SubmitButton
                    title={utvJSData.localization.saveAlbum}
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
              <SectionHeader text={utvJSData.localization.albumThumbnail}/>
              <AlbumThumbnailSelection
                currentThumbnail={this.state.thumbnail}
                thumbnails={this.state.thumbnails}
                updateThumbnail={this.updateThumbnailValue}
              />
            </Card>
          </Column>
        </Columns>
      </div>
    );
  }
}

export default AlbumEditTabView;