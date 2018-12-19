import React from 'react';

const ActionCell = (props) =>
{
  const {
    isChecked,
    dataIndex,
    toggleRowCheckbox,
    enableDragNDrop,
    enableBulkActions
  } = props;

  let checkboxNode = undefined;
  let reorderHandleNode = undefined;
  let classes = ['ccgriddle-action-cell', 'ccgriddle-column-primary'];

  if (enableBulkActions)
    checkboxNode = <input
      type="checkbox"
      checked={isChecked}
      onClick={() => toggleRowCheckbox(dataIndex)}
    />;

  if (enableDragNDrop)
    reorderHandleNode = <span className="ccgriddle-reorder-handle"></span>;

  return (
    <td className={classes.join(' ')}>
      {checkboxNode}
      {reorderHandleNode}
    </td>
  );
}

export default ActionCell;
