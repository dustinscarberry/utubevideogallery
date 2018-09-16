import React from 'react';
import Cell from './Cell';

const Row = (props) =>
{
  const cells = props.headers.map(x =>
  {
    let cellData = props.rowData[x.key];

    if (x.formatter)
      cellData = x.formatter(props.rowData, cellData);

    return (<Cell key={x.key} data={cellData}/>);
  });

  return (
    <tr>
      {cells}
    </tr>
  );
}

export default Row;
