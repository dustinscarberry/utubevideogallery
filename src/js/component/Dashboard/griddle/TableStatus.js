import React from 'react';

const TableStatus = (props) =>
{
  let lastRecord = props.page * props.pageSize;
  let firstRecord = (lastRecord - props.pageSize) + 1;

  if (lastRecord > props.recordCount)
    lastRecord = props.recordCount;

  return (
    <div className="ccgriddle-table-status">
      <span>{'Showing ' + firstRecord + ' to ' + lastRecord + ' of ' + props.recordCount + ' ' + props.recordLabel}</span>
    </div>
  );
}

export default TableStatus;
