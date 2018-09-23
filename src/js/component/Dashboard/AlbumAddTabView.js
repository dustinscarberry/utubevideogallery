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

class AlbumAddTabView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      title: '',
      videoSorting: undefined
    };

    this.changeValue = this.changeValue.bind(this);
    this.addAlbum = this.addAlbum.bind(this);
  }

  changeValue(event)
  {
    this.setState({[event.target.name]: event.target.value});
  }

  addAlbum()
  {

  }

  render()
  {
    return (
      <div>
        <Breadcrumbs
          crumbs={[
            {text: 'Galleries', onClick: () => this.props.changeGallery(undefined)},
            {text: 'Master', onClick: () => this.props.changeView(undefined)}
          ]}
        />
        <Columns>
          <Column className="utv-left-fixed-single-column">
            <Card>
              <SectionHeader text="Add Album"/>
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
                  <Label text="Video Sorting"/>
                  <SelectBox
                    name="videoSorting"
                    value={this.state.videoSorting}
                    onChange={this.changeValue}
                    data={[
                      {name: 'First to Last', value: 'asc'},
                      {name: 'Last to First', value: 'desc'}
                    ]}
                  />
                </FormField>
                <FormField classes="utv-formfield-action">
                  <SubmitButton
                    title="Add Album"
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

export default AlbumAddTabView;
