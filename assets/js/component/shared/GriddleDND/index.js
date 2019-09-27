import React, {Component} from 'react';
import axios from 'axios';
import Table from './Table';
import TableStatus from './TableStatus';
import BulkActions from './BulkActions';

class GriddleDND extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      data: [],
      bulkAction: undefined,
      sortKey: undefined,
      sortOrder: undefined,
      toggleAllCheckbox: false,
      loading: true
    };

    //bind functions
    this.updateColumnSort = this.updateColumnSort.bind(this);
    this.toggleRowCheckbox = this.toggleRowCheckbox.bind(this);
    this.toggleAllRowCheckboxes = this.toggleAllRowCheckboxes.bind(this);
    this.runBulkAction = this.runBulkAction.bind(this);
    this.updateBulkAction = this.updateBulkAction.bind(this);
    this.moveRow = this.moveRow.bind(this);
    this.reorderRows = this.reorderRows.bind(this);
  }

  componentDidMount()
  {
    //set loading and load initial table data
    this.setState({loading: true});
    this.loadData();
    this.setState({loading: false});
  }

  componentWillReceiveProps(nextProps)
  {
    if (this.props.apiLoadPath != nextProps.apiLoadPath)
      this.loadData();
  }

  async loadData()
  {
    //fetch data
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

      //add items to table
      this.setState({
        data: data
      });
    }
  }

  //change table row order
  moveRow(dragIndex, hoverIndex)
  {
    const { data } = this.state;
    const dragRow = data[dragIndex];

    //remove old row
    data.splice(dragIndex, 1);
    //add row to new index location
    data.splice(hoverIndex, 0, dragRow);

    //update state
		this.setState({data});
  }

  //pass state to external reorder row method
  reorderRows()
  {
    const { data } = this.state;
    if (this.props.reorderRows)
      this.props.reorderRows(data);
  }

  //check or uncheck row checkbox
  toggleRowCheckbox(dataIndex)
  {
    //flip state of row selected
    const { data } = this.state;
    data[dataIndex].rowSelected = !data[dataIndex].rowSelected;

    this.setState({data: data});
  }

  //check or uncheck all row checkboxes
  toggleAllRowCheckboxes(e)
  {
    const { data } = this.state;

    for (let i = 0; i < data.length; i++)
      data[i].rowSelected = e.target.checked;

    this.setState(
    {
      data,
      toggleAllCheckbox: e.target.checked
    });
  }

  //run outside bulkaction
  runBulkAction()
  {
    const selectedData = this.state.data.filter(x => x.rowSelected);

    this.setState({toggleAllCheckbox: false});

    this.props.bulkActionsData.callback(this.state.bulkAction, selectedData);
  }

  //update bulkaction in state
  updateBulkAction(e)
  {
    this.setState({bulkAction: e.target.value})
  }

  updateColumnSort(dataKey)
  {
    let {
      sortKey,
      sortOrder
    } = this.state;

    if (dataKey == sortKey)
    {
      if (sortOrder == 'asc')
        sortOrder = 'desc';
      else
        sortOrder = 'asc';
    }
    else
      sortOrder = 'asc';

    sortKey = dataKey;

    let { data } = this.state;

    data.sort(function(a, b)
    {
      let sort = 0;

      //sort asc for starting base
      if (a[sortKey] < b[sortKey])
        sort = -1;
      else if (a[sortKey] > b[sortKey])
        sort = 1;

      //if desc flip sort
      if (sortOrder == 'desc')
      {
        if (sort == 1)
          sort = -1;
        else
          sort = 1;
      }

      return sort;
    });

    this.setState({data, sortKey, sortOrder});
  }

  render()
  {
    const {
      enableBulkActions,
      bulkActionsData,
      headers,
      enableDragNDrop,
      recordLabel,
    } = this.props;

    const {
      sortKey,
      sortOrder
    } = this.state;

    let bulkActionNode = undefined;

    //include bulk action controls
    if (enableBulkActions && bulkActionsData)
      bulkActionNode = <BulkActions
        actionData={bulkActionsData}
        runBulkAction={this.runBulkAction}
        updateBulkAction={this.updateBulkAction}
        bulkAction={this.state.bulkAction}
      />;

    const tableStatusNode = <TableStatus
      recordCount={this.state.data.length}
      recordLabel={recordLabel}
    />;

    return (
      <div>
        {bulkActionNode}
        {tableStatusNode}
        <Table
          headers={headers}
          data={this.state.data}
          updateColumnSort={this.updateColumnSort}
          loading={this.state.loading}
          toggleRowCheckbox={this.toggleRowCheckbox}
          toggleAllRowCheckboxes={this.toggleAllRowCheckboxes}
          enableBulkActions={enableBulkActions}
          moveRow={this.moveRow}
          reorderRows={this.reorderRows}
          enableDragNDrop={enableDragNDrop}
          sortKey={sortKey}
          sortOrder={sortOrder}
          toggleAllCheckbox={this.state.toggleAllCheckbox}
        />
        {bulkActionNode}
        {tableStatusNode}
      </div>
    );
  }
}

GriddleDND.defaultProps = {
  enableBulkActions: false,
  bulkActionsData: undefined,
  enableDragNDrop: true,
  recordLabel: 'items',
  reorderRows: undefined
};

export default GriddleDND;
