import React from 'react';

const TableStatus = (props) =>
{
  const {
    recordCount,
    recordLabel
  } = props;

  const statusLabel = recordCount + ' ' + recordLabel;

  return (
    <div className="ccgriddle-table-status">
      <span>{statusLabel}</span>
    </div>
  );
}

export default TableStatus;
