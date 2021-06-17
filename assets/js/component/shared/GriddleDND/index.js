import React from 'react';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import Table from './Table';
import TableStatus from './TableStatus';
import BulkActions from './BulkActions';

class GriddleDND extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      bulkAction: undefined,
      sortKey: undefined,
      sortOrder: undefined,
      toggleAllCheckbox: false,
      isLoading: true
    };
  }

  // load initial table data
  componentDidMount() {
    this.loadData();
    this.setState({isLoading: false});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.apiLoadPath != prevProps.apiLoadPath)
      this.loadData();
  }

  loadData = async () => {
    //fetch data
    let apiData = await axios.get(this.props.apiLoadPath);

    //if api responds add data to state
    if (apiData.status == 200) {
      //run data through user defined mapper function
      let data = this.props.dataMapper(apiData.data.data);

      //if bulk actions enabled, add rowSelected property
      if (this.props.enableBulkActions) {
        data = data.map((item) => {
          item.rowSelected = false;
          return item;
        });
      }

      //add items to table
      this.setState({data});
    }
  }

  // change table row order
  moveRow = (dragIndex, hoverIndex) => {
    const data = cloneDeep(this.state.data);
    const dragRow = data[dragIndex];

    //remove old row
    data.splice(dragIndex, 1);
    //add row to new index location
    data.splice(hoverIndex, 0, dragRow);

    //update state
		this.setState({data});
  }

  // pass state to external reorder row method
  reorderRows = () => {
    if (this.props.reorderRows) {
      this.props.reorderRows(this.state.data);
    }
  }

  // check or uncheck row checkbox
  toggleRowCheckbox = (dataIndex) => {
    const data = cloneDeep(this.state.data);
    data[dataIndex].rowSelected = !data[dataIndex].rowSelected;
    this.setState({data});
  }

  // check or uncheck all row checkboxes
  toggleAllRowCheckboxes = (e) => {
    const data = cloneDeep(this.state.data);

    for (let i = 0; i < data.length; i++)
      data[i].rowSelected = e.target.checked;

    this.setState({data, toggleAllCheckbox: e.target.checked});
  }

  // run outside bulkaction
  runBulkAction = () => {
    const selectedData = this.state.data.filter(x => x.rowSelected);

    this.setState({toggleAllCheckbox: false});

    this.props.bulkActionsData.callback(this.state.bulkAction, selectedData);
  }

  // update bulkaction in state
  updateBulkAction = (e) => {
    this.setState({bulkAction: e.target.value})
  }

  updateColumnSort = (dataKey) => {
    let {
      sortKey,
      sortOrder
    } = this.state;

    if (dataKey == sortKey) {
      if (sortOrder == 'asc')
        sortOrder = 'desc';
      else
        sortOrder = 'asc';
    } else
      sortOrder = 'asc';

    sortKey = dataKey;

    const data = cloneDeep(this.state.data);

    data.sort(function(a, b) {
      let sort = 0;

      // sort asc for starting base
      if (a[sortKey] < b[sortKey])
        sort = -1;
      else if (a[sortKey] > b[sortKey])
        sort = 1;

      // if desc flip sort
      if (sortOrder == 'desc') {
        if (sort == 1)
          sort = -1;
        else
          sort = 1;
      }

      return sort;
    });

    this.setState({data, sortKey, sortOrder});
  }

  render() {
    const {
      enableBulkActions,
      bulkActionsData,
      headers,
      enableDragNDrop,
      recordLabel,
    } = this.props;

    const {
      data,
      toggleAllCheckbox,
      bulkAction,
      sortKey,
      sortOrder,
      isLoading
    } = this.state;

    // include bulk action controls
    let bulkActionNode = undefined;
    if (enableBulkActions && bulkActionsData)
      bulkActionNode = <BulkActions
        actionData={bulkActionsData}
        runBulkAction={this.runBulkAction}
        updateBulkAction={this.updateBulkAction}
        bulkAction={bulkAction}
      />;

    const tableStatusNode = <TableStatus
      recordCount={data.length}
      recordLabel={recordLabel}
    />;

    return <div>
      {bulkActionNode}
      {tableStatusNode}
      <Table
        headers={headers}
        data={data}
        updateColumnSort={this.updateColumnSort}
        isLoading={isLoading}
        toggleRowCheckbox={this.toggleRowCheckbox}
        toggleAllRowCheckboxes={this.toggleAllRowCheckboxes}
        enableBulkActions={enableBulkActions}
        moveRow={this.moveRow}
        reorderRows={this.reorderRows}
        enableDragNDrop={enableDragNDrop}
        sortKey={sortKey}
        sortOrder={sortOrder}
        toggleAllCheckbox={toggleAllCheckbox}
      />
      {bulkActionNode}
      {tableStatusNode}
    </div>
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
