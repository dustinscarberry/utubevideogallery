import React, {Component} from 'react';
import axios from 'axios';
import Table from './Table';
import PageRecords from './PageRecords';
import TableStatus from './TableStatus';
import Pagination from './Pagination';
import BulkActions from './BulkActions';

class Griddle extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      page: 1,
      pageSize: 25,
      sort: '',
      sortOrder: '',
      loading: true,
      //headers: undefined,
      data: [],
      pageLabel: 1
    };

    //bind functions
    this.updatePage = this.updatePage.bind(this);
    this.updatePageLabel = this.updatePageLabel.bind(this);
    this.blurPageLabel = this.blurPageLabel.bind(this);
    this.updateColumnSort = this.updateColumnSort.bind(this);
    this.loadData = this.loadData.bind(this);
    //this.setHeaders = this.setHeaders.bind(this);
  }

  componentDidMount()
  {
    //this.setHeaders();
    this.loadData();
  }

  componentWillReceiveProps(nextProps)
  {
    //this.setHeaders();

    if (this.props.apiLoadPath != nextProps.apiLoadPath)
      this.loadData();
  }

  //setHeaders()
  //{
   // this.setState({headers: this.props.headers});
  //}

  async updatePage(page)
  {
    if (page > 0)
      await this.setState({page: page, pageLabel: page});
  }

  async loadData()
  {
    await this.setState({loading: true});
    let apiData = await axios.get(this.props.apiLoadPath);

    if (apiData.status == 200)
    {
      let data = this.props.dataMapper(apiData.data.data);

      this.setState({
        data: data,
        loading: false
      });
    }
  }

  updatePageLabel(e)
  {
    let newPage = e.target.value;

    if (newPage != '')
    {
      this.setState({pageLabel: newPage});
      this.updatePage(parseInt(newPage));
    }
    else
      this.setState({pageLabel: newPage});
  }

  blurPageLabel(e)
  {
    let newPage = e.target.value;

    if (newPage == '')
      this.setState({pageLabel: this.state.page});
  }

  async updateColumnSort(e)
  {
    /*let key = e.target.getAttribute('data-key');
    let tempHeaders = this.state.headers;
    let sortOrder = undefined;

    for (let i = 0; i < tempHeaders.length; i++)
    {
      let tempHeader = tempHeaders[i];

      if (tempHeader.key == key)
      {
        if (tempHeader.sortDirection == '' || tempHeader.sortDirection == 'asc')
        {
          tempHeaders[i].sortDirection = 'desc';
          sortOrder = 'desc';
        }
        else
        {
          tempHeaders[i].sortDirection = 'asc';
          sortOrder = 'asc';
        }
      }
      else
        tempHeaders[i].sortDirection = '';
    }

    await this.setState({headers: tempHeaders, sort: key, sortOrder: sortOrder});*/
  }

  render()
  {
    let bulkActions = undefined;
    let useBulkActions = false;

    if (this.props.bulkActions)
    {
      bulkActions = <BulkActions actionData={this.props.bulkActions}/>
      useBulkActions = true;
    }




    /*<PageRecords
      pageSize={this.state.pageSize}
      updatePageSize={this.updatePageSize}
      recordLabel={this.props.recordLabel}
    />*/


    return (
      <div>
        {bulkActions}
        <Pagination
          page={this.state.page}
          pageSize={this.state.pageSize}
          recordCount={this.state.data.length}
          pageLabel={this.state.pageLabel}
          updatePage={this.updatePage}
          updatePageLabel={this.updatePageLabel}
          blurPageLabel={this.blurPageLabel}
        />
        <Table
          headers={this.props.headers}
          data={this.state.data}
          updateColumnSort={this.updateColumnSort}
          loading={this.state.loading}
          page={this.state.page}
          pageSize={this.state.pageSize}
          useBulkActions={useBulkActions}
        />
        <TableStatus
          page={this.state.page}
          pageSize={this.state.pageSize}
          recordCount={this.state.data.length}
          recordLabel={this.props.recordLabel}
        />
        <Pagination
          page={this.state.page}
          pageSize={this.state.pageSize}
          recordCount={this.state.data.length}
          pageLabel={this.state.pageLabel}
          updatePage={this.updatePage}
          updatePageLabel={this.updatePageLabel}
          blurPageLabel={this.blurPageLabel}
        />
      </div>
    );
  }
}

Griddle.defaultProps = {
  key: 'id',
  bulkActions: undefined
};

export default Griddle;
