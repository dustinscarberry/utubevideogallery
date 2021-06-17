import React from 'react';
import classnames from 'classnames';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableBodyDraggable from './TableBodyDraggable';

const Table = ({
  isLoading,
  enableDragNDrop,
  headers,
  data,
  toggleRowCheckbox,
  toggleAllRowCheckboxes,
  enableBulkActions,
  moveRow,
  reorderRows,
  updateColumnSort,
  sortKey,
  sortOrder,
  toggleAllCheckbox
}) => {
  let tableBody = undefined;
  if (!enableDragNDrop)
    tableBody = <TableBody
      headers={headers}
      data={data}
      toggleRowCheckbox={toggleRowCheckbox}
      enableBulkActions={enableBulkActions}
    />
  else
    tableBody = <TableBodyDraggable
      headers={headers}
      data={data}
      toggleRowCheckbox={toggleRowCheckbox}
      enableBulkActions={enableBulkActions}
      moveRow={moveRow}
      reorderRows={reorderRows}
    />

  return <table className={classnames({
    'ccgriddle-table': true,
    'is-loading': isLoading
  })}>
    <TableHeader
      headers={headers}
      updateColumnSort={updateColumnSort}
      sortKey={sortKey}
      sortOrder={sortOrder}
      toggleAllRowCheckboxes={toggleAllRowCheckboxes}
      enableBulkActions={enableBulkActions}
      enableDragNDrop={enableDragNDrop}
      toggleAllCheckbox={toggleAllCheckbox}
    />
    {tableBody}
  </table>
}

export default Table;
