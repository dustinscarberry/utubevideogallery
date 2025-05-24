import React from 'react';
import classnames from 'classnames';
import Cell from './Cell';
import ActionCell from './ActionCell';
import { DragSource } from 'react-dnd';
import { DropTarget } from 'react-dnd';

const itemType = 'row';

const rowSource = {
  beginDrag(props) {
    return {dataIndex: props.dataIndex};
  }
};

const rowSourceCollect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const rowTarget = {
  drop(props, monitor, component)
  {
    props.reorderRows();
    return undefined;
  },
  hover(props, monitor, component)
  {
    if (!component)
			return null;

		const dragIndex = monitor.getItem().dataIndex;
    const hoverIndex = props.dataIndex;

		//don't replace item with itself
		if (dragIndex === hoverIndex)
			return;

    //determine rectangle on screen
    const hoverBoundingRect = props.tableBodyRef.current.getBoundingClientRect();

    //get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    //get mouse position
    const clientOffset = monitor.getClientOffset();

		//get pixels to top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY)
			return;

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
			return;

		// Time to actually perform the action
		props.moveRow(dragIndex, hoverIndex);

		//change monitor index for performance reasons
		monitor.getItem().dataIndex = hoverIndex;
  }
};

const rowTargetCollect = (connect, monitor) => {
  return {connectDropTarget: connect.dropTarget()};
}

class RowDraggable extends React.Component
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
      toggleRowCheckbox,
      connectDragSource,
      connectDropTarget,
      isDragging,
      tableBodyRef
    } = this.props;

    const { expanded } = this.state;

    // build array of cells for row
    let cells = headers.map(header => {
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

    cells.unshift(
      <ActionCell
        key={dataIndex}
        isChecked={rowData.rowSelected}
        dataIndex={dataIndex}
        toggleRowCheckbox={toggleRowCheckbox}
        enableDragNDrop={true}
        enableBulkActions={enableBulkActions}
      />
    );

		const opacity = isDragging ? 0 : 1;

    return connectDragSource &&
			connectDropTarget &&
      connectDragSource(
  		connectDropTarget(
        <tr className={classnames({'ccgriddle-row-expanded': expanded})} style={{opacity}}>
          {cells}
        </tr>
      )
    );
  }
}

export default DragSource(itemType, rowSource, rowSourceCollect, {arePropsEqual: (props, otherProps) => {return false;}})(
  DropTarget(itemType, rowTarget, rowTargetCollect, {arePropsEqual: (props, otherProps) => {return false;}})(
    RowDraggable
  )
);
