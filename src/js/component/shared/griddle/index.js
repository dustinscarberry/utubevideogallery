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
      pageLabel: 1,



      bulkAction: undefined
    };

    //bind functions
    this.updatePage = this.updatePage.bind(this);
    this.updatePageLabel = this.updatePageLabel.bind(this);
    this.blurPageLabel = this.blurPageLabel.bind(this);
    this.updateColumnSort = this.updateColumnSort.bind(this);
    this.loadData = this.loadData.bind(this);
    this.toggleRowCheckbox = this.toggleRowCheckbox.bind(this);
    this.toggleAllRowCheckboxes = this.toggleAllRowCheckboxes.bind(this);
    this.runBulkAction = this.runBulkAction.bind(this);
    this.updateBulkAction = this.updateBulkAction.bind(this);
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
    //set loading status and fetch data
    await this.setState({loading: true});
    let apiData = await axios.get(this.props.apiLoadPath);

    //if api responds add data to state
    if (apiData.status == 200)
    {
      //run data through user defined mapper function
      let data = this.props.dataMapper(apiData.data.data);

      //if bulk actions enabled, add rowSelected property
      if (this.props.enableBulkActions)
      {
        data = data.map((item) => {
          item.rowSelected = false;
          return item;
        });
      }

      this.setState({
        data: data,
        loading: false
      });
    }
  }

  toggleRowCheckbox(dataIndex)
  {
    //flip state of row selected
    let data = this.state.data;
    data[dataIndex].rowSelected = !data[dataIndex].rowSelected;

    this.setState({data: data});
  }

  toggleAllRowCheckboxes(e)
  {
    let data = this.state.data;

    let startIndex = (this.state.page - 1) * this.state.pageSize;
    let endIndex = startIndex + this.state.pageSize;

    if (data.length < endIndex)
      endIndex = data.length;

    for (let i = startIndex; i < endIndex; i++)
      data[i].rowSelected = e.target.checked;

    this.setState({data: data});
  }

  runBulkAction()
  {
    let selectedData = this.state.data.filter(x => x.rowSelected);

    this.props.bulkActionsData.callback(this.state.bulkAction, selectedData);
  }

  updateBulkAction(e)
  {
    this.setState({bulkAction: e.target.value})
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

    if (this.props.enableBulkActions && this.props.bulkActionsData)
      bulkActions = <BulkActions
        actionData={this.props.bulkActionsData}
        runBulkAction={this.runBulkAction}
        updateBulkAction={this.updateBulkAction}
        bulkAction={this.state.bulkAction}
      />


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
          toggleRowCheckbox={this.toggleRowCheckbox}
          toggleAllRowCheckboxes={this.toggleAllRowCheckboxes}
          enableBulkActions={this.props.enableBulkActions}
          rowKey={this.props.rowKey}
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
  rowKey: 'id',
  enableBulkActions: true,
  bulkActionsData: undefined
};

export default Griddle;
