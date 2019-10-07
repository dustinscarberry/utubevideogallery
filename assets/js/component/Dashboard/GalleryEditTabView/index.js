import React from 'react';
import actions from './actions';
import utility from '../../shared/utility';
import Card from '../../shared/Card';
import Columns from '../../shared/Columns';
import Column from '../../shared/Column';
import SectionHeader from '../../shared/SectionHeader';
import Breadcrumbs from '../../shared/Breadcrumbs';
import Form from '../../shared/Form';
import FormField from '../../shared/FormField';
import Label from '../../shared/Label';
import TextInput from '../../shared/TextInput';
import SelectBox from '../../shared/SelectBox';
import SubmitButton from '../../shared/SubmitButton';
import CancelButton from '../../shared/CancelButton';
import Loader from '../../shared/Loader';

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
    const apiData = await actions.fetchGallery(this.props.currentViewID);

    if (utility.isValidResponse(apiData))
    {
      const data = utility.getAPIData(apiData);

      this.setState({
        title: data.title,
        albumSorting: data.sortDirection,
        thumbnailType: data.thumbnailType,
        originalThumbnailType: data.thumbnailType,
        displayType: data.displayType,
        updateDate: data.updateDate
      });
    }
    else if (utility.isErrorResponse(apiData))
      this.props.setFeedbackMessage(utility.getErrorMessage(apiData), 'error');
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

    const rsp = await actions.updateGallery(this.props.currentViewID, this.state);

    //update thumbnails if format changed
    if (utility.isValidResponse(rsp)
      && this.state.thumbnailType != this.state.originalThumbnailType
    )
    {
      await this.rebuildThumbnails();
      this.setState({originalThumbnailType: this.state.thumbnailType});
    }

    //user feedback
    if (utility.isValidResponse(rsp))
    {
      this.props.changeView();
      this.props.setFeedbackMessage(utvJSData.localization.feedbackGallerySaved);
    }
    else if (utility.isErrorResponse(rsp))
      this.props.setFeedbackMessage(utility.getErrorMessage(rsp), 'error');

    this.setState({loading: false});
  }

  async rebuildThumbnails()
  {
    const videosData = await actions.fetchGalleryVideos(this.props.currentViewID);

    if (utility.isValidResponse(videosData))
    {
      const videos = videosData.data.data;

      for (let video of videos)
      {
        //update video thumbnail
        const rsp = await actions.updateVideoThumbnail(video.id);

        //user feedback for thumbnail update
        this.props.setFeedbackMessage(actions.getThumbnailUpdateMessage(video.title));
      }
    }
    else if (utility.isErrorResponse(videosData))
      this.props.setFeedbackMessage(utility.getErrorMessage(videosData), 'error');
  }

  render()
  {
    const updateDateFormatted = utility.getFormattedDateTime(this.state.updateDate);

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
