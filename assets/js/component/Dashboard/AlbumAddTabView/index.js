import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import logic from './logic';
import apiHelper from 'helpers/api-helpers';

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

class AlbumAddTabView extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      album: {
        title: '',
        videoSorting: 'asc'
      }
    };
  }

  addAlbum = async() => {
    const { album } = this.state;
    const { selectedGallery, changeView, setFeedbackMessage } = this.props;

    const rsp = await logic.createAlbum(selectedGallery, album);

    if (apiHelper.isValidResponse(rsp)) {
      changeView();
      setFeedbackMessage(utvJSData.localization.feedbackAlbumCreated);
    } else if (apiHelper.isErrorResponse(rsp))
      setFeedbackMessage(apiHelper.getErrorMessage(rsp), 'error');
  }

  handleUpdateField = (e) => {
    const album = cloneDeep(this.state.album);
    album[e.target.name] = e.target.value;
    this.setState({album});
  }

  render() {
    const { selectedGalleryTitle, changeView, changeGallery } = this.props;
    const { album } = this.state;

    return <>
      <Breadcrumbs
        crumbs={[{
          text: utvJSData.localization.galleries,
          onClick: () => changeGallery()
        }, {
          text: selectedGalleryTitle,
          onClick: () => changeView()
        }]}
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
                  value={album.title}
                  onChange={this.handleUpdateField}
                  required={true}
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
                  required={true}
                />
              </FormField>
              <FormField classes="utv-formfield-action">
                <SubmitButton
                  title={utvJSData.localization.addAlbum}
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

export default AlbumAddTabView;
