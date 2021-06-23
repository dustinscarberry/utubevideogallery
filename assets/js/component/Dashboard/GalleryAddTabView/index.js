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

class GalleryAddTabView extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      gallery: {
        title: '',
        albumSorting: 'asc',
        thumbnailType: 'rectangle',
        displayType: 'album'
      }
    };
  }

  handleUpdateField = (e) => {
    const gallery = cloneDeep(this.state.gallery);
    gallery[e.target.name] = e.target.value;
    this.setState({gallery});
  }

  addGallery = async () => {
    const { changeView, setFeedbackMessage } = this.props;
    const { gallery } = this.state;

    const rsp = await logic.createGallery(gallery);

    if (apiHelper.isValidResponse(rsp)) {
      changeView();
      setFeedbackMessage(utvJSData.localization.feedbackGalleryCreated);
    } else if (apiHelper.isErrorResponse(rsp))
      setFeedbackMessage(apiHelper.getErrorMessage(rsp), 'error');
  }

  render() {
    const { changeView } = this.props;
    const { gallery } = this.state;

    return <div>
      <Breadcrumbs
        crumbs={[
          {text: utvJSData.localization.galleries, onClick: () => changeView()}
        ]}
      />
      <Columns>
        <Column className="utv-left-fixed-single-column">
          <Card>
            <SectionHeader text={utvJSData.localization.addGallery}/>
            <Form
              submit={this.addGallery}
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
                  required={true}
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
                  required={true}
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
                  required={true}
                />
              </FormField>
              <FormField classes={["utv-formfield-action"]}>
                <SubmitButton
                  title={utvJSData.localization.addGallery}
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
    </div>
  }
}

export default GalleryAddTabView;
