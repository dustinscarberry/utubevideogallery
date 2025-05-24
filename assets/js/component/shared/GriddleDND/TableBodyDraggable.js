import { useRef } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import RowDraggable from './RowDraggable';

const TableBodyDraggable = (props) => {
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

  const tableBodyRef = useRef();

  return (
    <DndProvider backend={HTML5Backend}>
      <tbody ref={tableBodyRef}>

        {data.map((row, i) =>
          <RowDraggable
            key={row.id}
            dataIndex={i}
            rowData={row}
            headers={headers}
            enableBulkActions={enableBulkActions}
            toggleRowCheckbox={toggleRowCheckbox}
            moveRow={moveRow}
            reorderRows={reorderRows}
            tableBodyRef={tableBodyRef}
          />
        )}

      </tbody>
    </DndProvider>
  );
}

export default TableBodyDraggable;
