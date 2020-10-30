import React from 'react';
import ReactMarkdown from 'react-markdown';
import actions from './actions';
import apiHelper from 'helpers/api-helpers';
import Card from 'component/shared/Card';
import SectionHeader from 'component/shared/SectionHeader';
import Loader from 'component/shared/Loader';

class DocumentationTabView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  async componentDidMount()
  {
    await this.loadData();

    this.setState({isLoading: false});
  }

  async loadData()
  {
    const apiData = await actions.fetchDocumentation();

    if (apiHelper.isValidResponse(apiData)) {
      const data = apiHelper.getAPIData(apiData);

      this.setState({
        documentation: data
      });
    } else if (apiHelper.isErrorResponse(apiData))
      this.props.setFeedbackMessage(apiHelper.getErrorMessage(apiData), 'error');
  }

  render()
  {
    if (this.state.isLoading)
      return <Loader/>;

    return (
      <Card>
        <SectionHeader text={utvJSData.localization.documentation}/>
        <ReactMarkdown source={this.state.documentation} />
      </Card>
    );
  }
}

export default DocumentationTabView;
