import React from 'react';
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
import actions from './actions';
import utility from '../../shared/utility';

class AlbumAddTabView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      title: '',
      videoSorting: 'asc'
    };
  }

  changeValue = (e) =>
  {
    this.setState({[e.target.name]: e.target.value});
  }

  addAlbum = async() =>
  {
    const rsp = await actions.createAlbum(
      this.state.title,
      this.state.videoSorting,
      this.props.selectedGallery
    );

    if (utility.isValidResponse(rsp))
    {
      this.props.changeView();
      this.props.setFeedbackMessage(utvJSData.localization.feedbackAlbumCreated);
    }
    else if (utility.isErrorResponse(rsp))
      this.props.setFeedbackMessage(utility.getErrorMessage(rsp), 'error');
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
