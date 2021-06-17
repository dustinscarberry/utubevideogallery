import React from 'react';
import classnames from 'classnames';
import Cell from './Cell';
import ActionCell from './ActionCell';

class Row extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  toggleRow = () => {
    this.setState({expanded: !this.state.expanded});
  }

  render() {
    const {
      headers,
      rowData,
      enableBulkActions,
      dataIndex,
      toggleRowCheckbox
    } = this.props;

    const { expanded } = this.state;

    // get table cells for row
    const cells = headers.map(header => {
      let cellData = rowData[header.key];
      let classes = [];

      if (header.formatter)
        cellData = header.formatter(rowData, cellData);

      if (header.primary) {
        cellData = <div>
          {cellData}
          <button className="ccgriddle-toggle-row" onClick={this.toggleRow}></button>
        </div>;

        classes.push('ccgriddle-column-primary');
      }

      return <Cell
        key={header.key}
        data={cellData}
        classes={classnames(classes)}
        columnName={header.title}
      />
    });

    // add action cell to row
    cells.unshift(
      <ActionCell
        key={dataIndex}
        isChecked={rowData.rowSelected}
        dataIndex={dataIndex}
        toggleRowCheckbox={toggleRowCheckbox}
        enableBulkActions={enableBulkActions}
      />
    );

    return <tr className={classnames({'ccgriddle-row-expanded': expanded})}>
      {cells}
    </tr>
  }
}

export default Row;
