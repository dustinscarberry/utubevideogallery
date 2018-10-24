import React from 'react';
import Cell from './Cell';
import CheckboxCell from './CheckboxCell';

const Row = (props) =>
{
  const cells = props.headers.map(x =>
  {
    let cellData = props.rowData[x.key];

    if (x.formatter)
      cellData = x.formatter(props.rowData, cellData);

    return (<Cell key={x.key} data={cellData}/>);
  });

  if (props.useBulkActions)
    cells.unshift(<CheckboxCell key={props.index} idKey={props.rowData['id']}/>);

  return (
    <tr>
      {cells}
    </tr>
  );
}

export default Row;
