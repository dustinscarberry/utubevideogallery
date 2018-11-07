import React from 'react';
import Row from './Row';

const TableBody = (props) =>
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

  const rows = data.map((row, i) =>
    <Row
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

export default TableBody;
