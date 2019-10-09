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
import actions from './actions';
import utility from '../../shared/utility';

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

    if (utility.isValidResponse(apiData))
    {
      const data = utility.getAPIData(apiData);

      this.setState({
        thumbnail: data.thumbnail,
        title: data.title,
        videoSorting: data.sortDirection,
        updateDate: data.updateDate,
        gallery: data.galleryID
      });
    }
    else if (utility.isErrorResponse(apiData))
      this.props.setFeedbackMessage(utility.getErrorMessage(apiData), 'error');
  }

  async loadGalleries()
  {
    const apiData = await actions.fetchGalleries();

    if (utility.isValidResponse(apiData))
    {
      const data = utility.getAPIData(apiData);
      const galleries = actions.parseGalleriesData(data);
      this.setState({galleries});
    }
  }

  async loadThumbnails()
  {
    const apiData = await actions.fetchThumbnails(this.props.currentViewID);

    if (utility.isValidResponse(apiData))
    {
      const data = utility.getAPIData(apiData);
      const thumbnails = actions.parseThumbnailsData(data);
      this.setState({thumbnails});
    }
    else if (utility.isErrorResponse(apiData))
      this.props.setFeedbackMessage('Loading album thumbnails failed', 'error');
  }

  changeValue = (e) =>
  {
    this.setState({[e.target.name]: e.target.value});
  }

  changeCheckboxValue = (e) =>
  {
    this.setState({[e.target.name]: !this.state[e.target.name]});
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

    if (utility.isValidResponse(rsp))
    {
      this.props.changeView();
      this.props.setFeedbackMessage(utvJSData.localization.feedbackAlbumSaved);
    }
    else if (utility.isErrorResponse(rsp))
      this.props.setFeedbackMessage(utility.getErrorMessage(rsp), 'error');
  }

  render()
  {
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
                    value={utility.getFormattedDateTime(this.state.updateDate)}
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
