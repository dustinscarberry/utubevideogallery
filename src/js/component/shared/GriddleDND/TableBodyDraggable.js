import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import Row from './Row';
import RowDraggable from './RowDraggable';

const TableBodyDraggable = (props) =>
{
  const {
    data,
    headers,
    useBulkActions,
    enableBulkActions,
    toggleRowCheckbox,
    rowKey,
    moveRow
  } = props;

  let rows = data.map((row, i) =>
    <RowDraggable
      key={row.id}
      dataIndex={i}
      rowData={row}
      headers={headers}
      enableBulkActions={enableBulkActions}
      toggleRowCheckbox={toggleRowCheckbox}
      moveRow={moveRow}
    />
  );

  return (
    <tbody>{rows}</tbody>
  );
}

export default DragDropContext(HTML5Backend)(TableBodyDraggable);
