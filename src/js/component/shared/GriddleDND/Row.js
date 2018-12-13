import React from 'react';
import Cell from './Cell';
import ActionCell from './ActionCell';

class Row extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    const {
      headers,
      rowData,
      enableBulkActions,
      dataIndex,
      toggleRowCheckbox
    } = this.props;

    //build array of cells for row
    const cells = headers.map(header =>
    {
      let cellData = rowData[header.key];

      if (header.formatter)
        cellData = header.formatter(rowData, cellData);

      return (<Cell key={header.key} data={cellData}/>);
    });

    cells.unshift(
      <ActionCell
        key={dataIndex}
        isChecked={rowData.rowSelected}
        dataIndex={dataIndex}
        toggleRowCheckbox={toggleRowCheckbox}
        enableBulkActions={enableBulkActions}
      />
    );

    return (
      <tr>
        {cells}
      </tr>
    );
  }
}

export default Row;
