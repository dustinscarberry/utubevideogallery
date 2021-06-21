import React from 'react';
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
import SubmitButton from 'component/shared/SubmitButton';
import CancelButton from 'component/shared/CancelButton';
import Loader from 'component/shared/Loader';
import AlbumThumbnailSelection from './AlbumThumbnailSelection';
import actions from './actions';
import apiHelper from 'helpers/api-helpers';
import { getFormattedDateTime } from 'helpers/datetime-helpers';

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
      isLoading: true
    };
  }

  async componentDidMount() {
    //load api data
    await Promise.all([
      this.loadData(),
      this.loadGalleries(),
      this.loadThumbnails()
    ]);

    //set loading state
    this.setState({isLoading: false});
  }

  loadData = async () => {
    const apiData = await actions.fetchAlbum(this.props.currentViewID);

    if (apiHelper.isValidResponse(apiData))
    {
      const data = apiHelper.getAPIData(apiData);

      this.setState({
        thumbnail: data.thumbnail,
        title: data.title,
        videoSorting: data.sortDirection,
        updateDate: data.updateDate,
        gallery: data.galleryID
      });
    }
    else if (apiHelper.isErrorResponse(apiData))
      this.props.setFeedbackMessage(apiHelper.getErrorMessage(apiData), 'error');
  }

  loadGalleries = async () => {
    const apiData = await actions.fetchGalleries();

    if (apiHelper.isValidResponse(apiData))
    {
      const data = apiHelper.getAPIData(apiData);
      const galleries = actions.parseGalleriesData(data);
      this.setState({galleries});
    }
  }

  loadThumbnails = async () => {
    const apiData = await actions.fetchThumbnails(this.props.currentViewID);

    if (apiHelper.isValidResponse(apiData))
    {
      const data = apiHelper.getAPIData(apiData);
      const thumbnails = actions.parseThumbnailsData(data);
      this.setState({thumbnails});
    }
    else if (apiHelper.isErrorResponse(apiData))
      this.props.setFeedbackMessage('Loading album thumbnails failed', 'error');
  }

  changeValue = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  changeCheckboxValue = (e) => {
    this.setState({[e.target.name]: !this.state[e.target.name]});
  }

  updateThumbnailValue = (thumbnail) => {
    if (thumbnail)
      this.setState({thumbnail});
  }

  saveAlbum = async () => {
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

    if (apiHelper.isValidResponse(rsp))
    {
      this.props.changeView();
      this.props.setFeedbackMessage(utvJSData.localization.feedbackAlbumSaved);
    }
    else if (apiHelper.isErrorResponse(rsp))
      this.props.setFeedbackMessage(apiHelper.getErrorMessage(rsp), 'error');
  }

  render() {
    const {
      isLoading,
      title,
      gallery,
      galleries,
      videoSorting,
      updateDate,
      thumbnail,
      thumbnails
    } = this.state;

    const { changeGallery, changeAlbum, changeView } = this.props;

    if (isLoading)
      return <Loader/>

    return <div>
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
                  value={title}
                  onChange={this.changeValue}
                  required={true}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.gallery}/>
                <SelectBox
                  name="gallery"
                  value={gallery}
                  onChange={this.changeValue}
                  choices={galleries}
                />
              </FormField>
              <FormField>
                <Label text={utvJSData.localization.videoSorting}/>
                <SelectBox
                  name="videoSorting"
                  value={videoSorting}
                  onChange={this.changeValue}
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
                  value={getFormattedDateTime(updateDate)}
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
              currentThumbnail={thumbnail}
              thumbnails={thumbnails}
              updateThumbnail={this.updateThumbnailValue}
            />
          </Card>
        </Column>
      </Columns>
    </div>
  }
}

export default AlbumEditTabView;
