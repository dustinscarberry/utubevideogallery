import React from 'react';
import Cell from './Cell';
import ActionCell from './ActionCell';

class Row extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      expanded: false
    };

    this.toggleRow = this.toggleRow.bind(this);
  }

  toggleRow()
  {
    this.setState({expanded: !this.state.expanded});
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

    const rowClasses = [];

    if (this.state.expanded)
      rowClasses.push('ccgriddle-row-expanded');

    //build array of cells for row
    const cells = headers.map(header =>
    {
      let cellData = rowData[header.key];

      let classes = [];

      if (header.formatter)
        cellData = header.formatter(rowData, cellData);

      if (header.primary)
      {
        cellData = <div>
          {cellData}
          <button className="ccgriddle-toggle-row" onClick={this.toggleRow}></button>
        </div>;

        classes.push('ccgriddle-column-primary');
      }

      return (<Cell key={header.key} data={cellData} classes={classes} columnName={header.title}/>);
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
      <tr className={rowClasses.join(' ')}>
        {cells}
      </tr>
    );
  }
}

export default Row;
