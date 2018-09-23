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
import URLInput from '../shared/URLInput';
import Toggle from '../shared/Toggle';
import SelectBox from '../shared/SelectBox';
import NumberInput from '../shared/NumberInput';
import Button from '../shared/Button';
import SubmitButton from '../shared/SubmitButton';

class GalleryAddTabView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      title: '',
      albumSorting: undefined,
      thumbnailType: undefined,
      displayType: undefined
    };

    this.changeValue = this.changeValue.bind(this);
    this.addGallery = this.addGallery.bind(this);
  }

  changeValue(event)
  {
    this.setState({[event.target.name]: event.target.value});
  }

  addGallery()
  {

  }

  render()
  {
    return (
      <div>
        <Breadcrumbs
          crumbs={[
            {text: 'Galleries', onClick: () => this.props.changeView(undefined)}
          ]}
        />
        <Columns>
          <Column className="utv-left-fixed-single-column">
            <Card>
              <SectionHeader text="Add Gallery"/>
              <Form
                submit={this.addGallery}
                errorclass="utv-invalid-feedback"
              >
                <FormField>
                  <Label text="Title"/>
                  <TextInput
                    name="title"
                    value={this.state.title}
                    onChange={this.changeValue}
                    required={true}
                  />
                </FormField>
                <FormField>
                  <Label text="Album Sorting"/>
                  <SelectBox
                    name="albumSorting"
                    value={this.state.albumSorting}
                    onChange={this.changeValue}
                    data={[
                      {name: 'First to Last', value: 'asc'},
                      {name: 'Last to First', value: 'desc'}
                    ]}
                  />
                </FormField>
                <FormField>
                  <Label text="Thumbnail Type"/>
                  <SelectBox
                    name="thumbnailType"
                    value={this.state.thumbnailType}
                    onChange={this.changeValue}
                    data={[
                      {name: 'Rectangle', value: 'rectangle'},
                      {name: 'Square', value: 'square'}
                    ]}
                  />
                </FormField>
                <FormField>
                  <Label text="Display Type"/>
                  <SelectBox
                    name="displayType"
                    value={this.state.displayType}
                    onChange={this.changeValue}
                    data={[
                      {name: 'Albums', value: 'album'},
                      {name: 'Just Videos', value: 'video'}
                    ]}
                  />
                </FormField>
                <FormField classes="utv-formfield-action">
                  <SubmitButton
                    title="Add Gallery"
                    classes="button-primary"
                  />
                  <Button
                    title="Cancel"
                    classes="utv-cancel"
                    onClick={() => this.props.changeView(undefined)}
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

export default GalleryAddTabView;
