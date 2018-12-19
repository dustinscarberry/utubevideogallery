import React from 'react';
import axios from 'axios';
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
import URLInput from '../shared/URLInput';
import Toggle from '../shared/Toggle';
import SelectBox from '../shared/SelectBox';
import NumberInput from '../shared/NumberInput';
import SubmitButton from '../shared/SubmitButton';
import CancelButton from '../shared/CancelButton';

class AlbumAddTabView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      title: '',
      videoSorting: 'asc'
    };

    this.changeValue = this.changeValue.bind(this);
    this.addAlbum = this.addAlbum.bind(this);
  }

  changeValue(event)
  {
    this.setState({[event.target.name]: event.target.value});
  }

  async addAlbum()
  {
    const rsp = await axios.post(
      '/wp-json/utubevideogallery/v1/albums/',
      {
        title: this.state.title,
        videoSorting: this.state.videoSorting,
        galleryID: this.props.selectedGallery
      },
      {
        headers: {'X-WP-Nonce': utvJSData.restNonce}
      }
    );

    if (
      rsp.status == 201
      && !rsp.data.error
    )
    {
      this.props.changeView();
      this.props.setFeedbackMessage(utvJSData.localization.feedbackAlbumCreated, 'success');
    }
    else
      this.props.setFeedbackMessage(rsp.data.error.message, 'error');
  }

  render()
  {
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
              onClick: () => this.props.changeView()
            }
          ]}
        />
        <Columns>
          <Column className="utv-left-fixed-single-column">
            <Card>
              <SectionHeader text="Add Album"/>
              <Form
                submit={this.addAlbum}
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
                  <Label text={utvJSData.localization.videoSorting}/>
                  <SelectBox
                    name="videoSorting"
                    value={this.state.videoSorting}
                    onChange={this.changeValue}
                    data={[
                      {name: utvJSData.localization.firstToLast, value: 'asc'},
                      {name: utvJSData.localization.lastToFirst, value: 'desc'}
                    ]}
                    required={true}
                  />
                </FormField>
                <FormField classes="utv-formfield-action">
                  <SubmitButton
                    title={utvJSData.localization.addAlbum}
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

export default AlbumAddTabView;
