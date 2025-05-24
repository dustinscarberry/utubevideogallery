import Row from './Row';

const TableBody = ({
  data,
  headers,
  useBulkActions,
  enableBulkActions,
  toggleRowCheckbox,
  rowKey,
  moveRow
}) => {
  return <tbody>
    {data.map((row, i) =>
      <Row
        key={row.id}
        dataIndex={i}
        rowData={row}
        headers={headers}
        enableBulkActions={enableBulkActions}
        toggleRowCheckbox={toggleRowCheckbox}
        moveRow={moveRow}
      />
    )}
  </tbody>
}

export default TableBody;
