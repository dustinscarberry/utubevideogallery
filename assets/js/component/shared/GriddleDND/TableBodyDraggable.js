import React from 'react';
//import HTML5Backend from 'react-dnd-html5-backend';
//import { DragDropContext } from 'react-dnd';
import Row from './Row';
import RowDraggable from './RowDraggable';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const TableBodyDraggable = (props) =>
{
  const {
    data,
    headers,
    useBulkActions,
    enableBulkActions,
    toggleRowCheckbox,
    rowKey,
    moveRow,
    reorderRows
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
      reorderRows={reorderRows}
    />
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <tbody>{rows}</tbody>
    </DndProvider>
  );
}

export default TableBodyDraggable;
