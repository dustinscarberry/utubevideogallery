import React from 'react';

const TableStatus = ({recordCount, recordLabel}) => {
  const statusLabel = recordCount + ' ' + recordLabel;

  return <div className="ccgriddle-table-status">
    <span>{statusLabel}</span>
  </div>
}

export default TableStatus;
