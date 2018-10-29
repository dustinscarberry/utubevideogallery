import React from 'react';
import Cell from './Cell';
import CheckboxCell from './CheckboxCell';

const Row = (props) =>
{
  //build array of cells for row
  const cells = props.headers.map(x =>
  {
    let cellData = props.rowData[x.key];

    if (x.formatter)
      cellData = x.formatter(props.rowData, cellData);

    return (<Cell key={x.key} data={cellData}/>);
  });

  //add checkbox cell if bulk actions enabled
  if (props.enableBulkActions)
    cells.unshift(
      <CheckboxCell
        key={props.index}

        isChecked={props.rowData.rowSelected}
        dataIndex={props.index}

        toggleRowCheckbox={props.toggleRowCheckbox}
      />
    );

  return (
    <tr>
      {cells}
    </tr>
  );
}

export default Row;
