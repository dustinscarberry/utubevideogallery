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
import Toggle from '../shared/Toggle';
import SelectBox from '../shared/SelectBox';
import SubmitButton from '../shared/SubmitButton';
import CancelButton from '../shared/CancelButton';
import Loader from '../shared/Loader';
import sharedService from '../../service/SharedService';
import axios from 'axios';
import {
  isValidResponse,
  isErrorResponse,
  getErrorMessage
} from '../shared/service/shared';

class GalleryEditTabView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      title: '',
      albumSorting: undefined,
      thumbnailType: undefined,
      originalThumbnailType: undefined,
      displayType: undefined,
      updateDate: undefined,
      loading: true
    };
  }

  async componentDidMount()
  {
    //load api data
    await this.loadData();

    //set loading state
    this.setState({loading: false});
  }

  async loadData()
  {
    const apiData = await axios.get(
      '/wp-json/utubevideogallery/v1/galleries/'
      + this.props.currentViewID,
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (isValidResponse(apiData))
    {
      const data = apiData.data.data;

      this.setState({
        title: data.title,
        albumSorting: data.sortDirection,
        thumbnailType: data.thumbnailType,
        originalThumbnailType: data.thumbnailType,
        displayType: data.displayType,
        updateDate: data.updateDate
      });
    }
    else if (isErrorResponse(apiData))
      this.props.setFeedbackMessage(getErrorMessage(apiData), 'error');
  }

  changeValue = (event) =>
  {
    this.setState({[event.target.name]: event.target.value});
  }

  changeCheckboxValue = (event) =>
  {
    this.setState({[event.target.name]: !this.state[event.target.name]});
  }

  saveGallery = async() =>
  {
    this.setState({loading: true});

    const rsp = await this.saveBaseGallery();

    //update thumbnails if format changed
    if (isValidResponse(rsp) && this.state.thumbnailType != this.state.originalThumbnailType)
    {
      await this.rebuildThumbnails();
      this.setState({originalThumbnailType: this.state.thumbnailType});
    }

    //user feedback
    if (isValidResponse(rsp))
    {
      this.props.changeView();
      this.props.setFeedbackMessage(utvJSData.localization.feedbackGallerySaved);
    }
    else if (isErrorResponse(rsp))
      this.props.setFeedbackMessage(getErrorMessage(rsp), 'error');

    this.setState({loading: false});
  }

  async saveBaseGallery()
  {
    const rsp = await axios.patch(
      '/wp-json/utubevideogallery/v1/galleries/'
      + this.props.currentViewID,
      {
        title: this.state.title,
        albumSorting: this.state.albumSorting,
        thumbnailType: this.state.thumbnailType,
        displayType: this.state.displayType
      },
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    return rsp;
  }

  async rebuildThumbnails()
  {
    const videosData = await axios.get(
      '/wp-json/utubevideogallery/v1/galleries/'
      + this.props.currentViewID
      + '/videos',
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (isValidResponse(videosData))
    {
      const videos = videosData.data.data;

      for (let video of videos)
      {
        const rsp = await axios.patch(
          '/wp-json/utubevideogallery/v1/videos/'
          + video.id,
          {},
          {
            headers: {'X-WP-Nonce': utvJSData.restNonce}
          }
        );

        //update status about what video is being rebuilt
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
    else if (isErrorResponse(videosData))
      this.props.setFeedbackMessage(getErrorMessage(videosData), 'error');
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
              onClick: () => this.props.changeView()
            }
          ]}
        />
        <Columns>
          <Column className="utv-left-fixed-single-column">
            <Card>
              <SectionHeader text={utvJSData.localization.editGallery}/>
              <Form
                submit={this.saveGallery}
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
                  <Label text={utvJSData.localization.albumSorting}/>
                  <SelectBox
                    name="albumSorting"
                    value={this.state.albumSorting}
                    onChange={this.changeValue}
                    data={[
                      {name: utvJSData.localization.ascending, value: 'asc'},
                      {name: utvJSData.localization.descending, value: 'desc'}
                    ]}
                  />
                </FormField>
                <FormField>
                  <Label text={utvJSData.localization.thumbnailType}/>
                  <SelectBox
                    name="thumbnailType"
                    value={this.state.thumbnailType}
                    onChange={this.changeValue}
                    data={[
                      {name: utvJSData.localization.rectangle, value: 'rectangle'},
                      {name: utvJSData.localization.square, value: 'square'}
                    ]}
                  />
                </FormField>
                <FormField>
                  <Label text={utvJSData.localization.displayType}/>
                  <SelectBox
                    name="displayType"
                    value={this.state.displayType}
                    onChange={this.changeValue}
                    data={[
                      {name: utvJSData.localization.albums, value: 'album'},
                      {name: utvJSData.localization.justVideos, value: 'video'}
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
                    title={utvJSData.localization.saveGallery}
                  />
                  <CancelButton
                    title={utvJSData.localization.cancel}
                    onClick={() => this.props.changeView()}
                  />
                </FormField>
              </Form>
            </Card>
          </Column>
        </Columns>
      </div>
    );
  }
}

export default GalleryEditTabView;
