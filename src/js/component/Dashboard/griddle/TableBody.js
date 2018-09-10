import React from 'react';
import Row from './Row';

const TableBody = (props) =>
{
  let page = parseInt(props.page);
  let pageSize = parseInt(props.pageSize);
  let startIndex = (page - 1) * pageSize;
  let endIndex = startIndex + pageSize;
  let data = props.data.slice(startIndex, endIndex);

  let rows = data.map((x, index) =>
    <Row
      key={index}
      rowData={x}
      headers={props.headers}
    />
  );

  return (
    <tbody>{rows}</tbody>
  );
}

export default TableBody;