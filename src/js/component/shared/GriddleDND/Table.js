import React from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableBodyDraggable from './TableBodyDraggable';

const Table = (props) =>
{
  const {
    loading,
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
  } = props;

  const classArray = ['ccgriddle-table'];
  let tableBody = undefined;

  if (loading)
    classArray.push('is-loading');

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

  return (
    <table className={classArray.join(' ')}>
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
  );
}

export default Table;
