import React from 'react';
import Card from '../shared/Card';
import Columns from '../shared/Columns';
import Column from '../shared/Column';
import SectionHeader from '../shared/SectionHeader';
import ResponsiveIframe from '../shared/ResponsiveIframe';
import Breadcrumbs from '../shared/Breadcrumbs';
import Form from '../shared/Form';
import FormField from '../shared/FormField';
import Label from '../shared/Label';
import FieldHint from '../shared/FieldHint';
import TextInput from '../shared/TextInput';
import Toggle from '../shared/Toggle';
import SelectBox from '../shared/SelectBox';
import NumberInput from '../shared/NumberInput';
import Button from '../shared/Button';
import SubmitButton from '../shared/SubmitButton';
import Loader from '../shared/Loader';
import axios from 'axios';

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

    this.changeValue = this.changeValue.bind(this);
    this.changeCheckboxValue = this.changeCheckboxValue.bind(this);
    this.saveGallery = this.saveGallery.bind(this);
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

    if (
      apiData.status == 200
      && !apiData.data.error
    )
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
  }

  changeValue(event)
  {
    this.setState({[event.target.name]: event.target.value});
  }

  changeCheckboxValue(event)
  {
    this.setState({[event.target.name]: !this.state[event.target.name]});
  }

  async saveGallery()
  {
    this.setState({loading: true});

    const rsp = await this.saveBaseGallery();

    //update thumbnails if type changed
    if (this.state.thumbnailType != this.state.originalThumbnailType)
    {
      await this.rebuildThumbnails();
      this.setState({originalThumbnailType: this.state.thumbnailType});
    }

    //final user feedback
    if (
      rsp.status == 200
      && !rsp.data.error
    )
    {
      this.props.changeView();
      this.props.setFeedbackMessage(utvJSData.localization.feedbackGallerySaved, 'success');
    }
    else
      this.props.setFeedbackMessage(rsp.data.error.message, 'error');

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
      '/wp-json/utubevideogallery/v1/videos',
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (
      videosData.status == 200
      && !videosData.data.error
    )
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
  }

  render()
  {
    const updateDate = new Date(this.state.updateDate * 1000);
    const updateDateFormatted = updateDate.toLocaleString(
      'en-US',
      {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }
    );

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
                      {name: utvJSData.localization.firstToLast, value: 'asc'},
                      {name: utvJSData.localization.lastToFirst, value: 'desc'}
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
                    classes="button-primary"
                  />
                  <Button
                    title={utvJSData.localization.cancel}
                    classes="utv-cancel"
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
