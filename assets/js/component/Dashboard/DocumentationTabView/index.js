import React from 'react';
import ReactMarkdown from 'react-markdown';
import actions from './actions';
import utility from '../../shared/utility';
import Card from '../../shared/Card';
import SectionHeader from '../../shared/SectionHeader';
import Loader from '../../shared/Loader';

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

    if (utility.isValidResponse(apiData)) {
      const data = utility.getAPIData(apiData);

      this.setState({
        documentation: data
      });
    } else if (utility.isErrorResponse(apiData))
      this.props.setFeedbackMessage(utility.getErrorMessage(apiData), 'error');
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
