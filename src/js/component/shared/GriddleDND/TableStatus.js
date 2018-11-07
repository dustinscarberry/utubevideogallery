import React from 'react';

const TableStatus = (props) =>
{
  const {
    recordCount, 
    recordLabel
  } = props;

  return (
    <div className="ccgriddle-table-status">
      <span>{recordCount + ' ' + recordLabel}</span>
    </div>
  );
}

export default TableStatus;
