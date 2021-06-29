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

class GalleryEditTabView extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      gallery: {
        title: '',
        albumSorting: undefined,
        thumbnailType: undefined,
        originalThumbnailType: undefined,
        displayType: undefined,
        updateDate: undefined
      },
      isLoading: true
    };
  }

  async componentDidMount() {
    // load api data
    await this.loadData();
    this.setState({isLoading: false});
  }

  loadData = async () => {
    const { setFeedbackMessage } = this.props;

    const apiData = await logic.fetchGallery(this.props.currentViewID);

    if (apiHelper.isValidResponse(apiData)) {
      const data = apiData.data.data;
      this.setState({
        gallery: {
          title: data.title,
          albumSorting: data.sortDirection,
          thumbnailType: data.thumbnailType,
          originalThumbnailType: data.thumbnailType,
          displayType: data.displayType,
          updateDate: data.updateDate
        }
      });
    }
    else if (apiHelper.isErrorResponse(apiData))
      setFeedbackMessage(apiHelper.getErrorMessage(apiData), 'error');
  }

  handleUpdateField = (e) => {
    const gallery = cloneDeep(this.state.gallery);
    gallery[e.target.name] = e.target.value;
    this.setState({gallery});
  }

  saveGallery = async () => {
    const { currentViewID, changeView, setFeedbackMessage } = this.props;
    const { gallery } = this.state;

    this.setState({isLoading: true});

    const rsp = await logic.updateGallery(currentViewID, gallery);

    // update thumbnails if format changed
    if (apiHelper.isValidResponse(rsp)
      && gallery.thumbnailType != gallery.originalThumbnailType
    ) {
      await this.rebuildThumbnails();
      const galleryClone = cloneDeep(gallery);
      galleryClone.originalThumbnailType = galleryClone.thumbnailType;
      this.setState({gallery: galleryClone});
    }

    // user feedback
    if (apiHelper.isValidResponse(rsp)) {
      changeView();
      setFeedbackMessage(utvJSData.localization.feedbackGallerySaved);
    } else if (apiHelper.isErrorResponse(rsp))
      setFeedbackMessage(apiHelper.getErrorMessage(rsp), 'error');

    this.setState({isLoading: false});
  }

  rebuildThumbnails = async () => {
    const { currentViewID, setFeedbackMessage } = this.props;

    const videosData = await logic.fetchGalleryVideos(currentViewID);

    if (apiHelper.isValidResponse(videosData)) {
      const videos = videosData.data.data;

      for (const video of videos) {
        // update video thumbnail
        const rsp = await logic.updateVideoThumbnail(video.id);
        setFeedbackMessage(logic.getThumbnailUpdateMessage(video.title));
      }
    } else if (apiHelper.isErrorResponse(videosData))
      tsetFeedbackMessage(apiHelper.getErrorMessage(videosData), 'error');
  }

  render() {
    const { isLoading, gallery } = this.state;
    const { changeView } = this.props;

    if (isLoading) return <Loader/>

    return <>
      <Breadcrumbs
        crumbs={[{
          text: utvJSData.localization.galleries,
          onClick: () => changeView()
        }]}
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
                  value={gallery.title}
                  onChange={this.handleUpdateField}
                  required={true}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.albumSorting}/>
                <SelectBox
                  name="albumSorting"
                  value={gallery.albumSorting}
                  onChange={this.handleUpdateField}
                  choices={[
                    {name: utvJSData.localization.ascending, value: 'asc'},
                    {name: utvJSData.localization.descending, value: 'desc'}
                  ]}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.thumbnailType}/>
                <SelectBox
                  name="thumbnailType"
                  value={gallery.thumbnailType}
                  onChange={this.handleUpdateField}
                  choices={[
                    {name: utvJSData.localization.rectangle, value: 'rectangle'},
                    {name: utvJSData.localization.square, value: 'square'}
                  ]}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.displayType}/>
                <SelectBox
                  name="displayType"
                  value={gallery.displayType}
                  onChange={this.handleUpdateField}
                  choices={[
                    {name: utvJSData.localization.albums, value: 'album'},
                    {name: utvJSData.localization.justVideos, value: 'video'}
                  ]}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.lastUpdated}/>
                <TextInput
                  name="updateDate"
                  value={getFormattedDateTime(gallery.updateDate)}
                  disabled={true}
                />
              </FormField>
              <FormField classes="utv-formfield-action">
                <SubmitButton
                  title={utvJSData.localization.saveGallery}
                />
                <CancelButton
                  title={utvJSData.localization.cancel}
                  onClick={() => changeView()}
                />
              </FormField>
            </Form>
          </Card>
        </Column>
      </Columns>
    </>
  }
}

export default GalleryEditTabView;
