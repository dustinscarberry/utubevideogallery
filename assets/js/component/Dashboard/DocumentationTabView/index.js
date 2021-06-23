import React from 'react';
import ReactMarkdown from 'react-markdown';
import logic from './logic';
import apiHelper from 'helpers/api-helpers';
import Card from 'component/shared/Card';
import SectionHeader from 'component/shared/SectionHeader';
import Loader from 'component/shared/Loader';

class DocumentationTabView extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    await this.loadData();
    this.setState({isLoading: false});
  }

  loadData = async () => {
    const { setFeedbackMessage } = this.props;

    const apiData = await logic.fetchDocumentation();

    if (apiHelper.isValidResponse(apiData)) {
      this.setState({documentation: apiData.data.data});
    } else if (apiHelper.isErrorResponse(apiData))
      setFeedbackMessage(apiHelper.getErrorMessage(apiData), 'error');
  }

  render() {
    const { isLoading, documentation } = this.state;

    if (isLoading) return <Loader/>

    return <Card>
      <SectionHeader text={utvJSData.localization.documentation}/>
      <ReactMarkdown>{documentation}</ReactMarkdown>
    </Card>
  }
}

export default DocumentationTabView;
