import React from 'react';

const ActionCell = ({
  isChecked,
  dataIndex,
  toggleRowCheckbox,
  enableDragNDrop,
  enableBulkActions
}) => {
  return <td className="ccgriddle-action-cell ccgriddle-column-primary">
    {enableBulkActions &&
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => toggleRowCheckbox(dataIndex)}
      />
    }
    {enableDragNDrop &&
      <span className="ccgriddle-reorder-handle"></span>
    }
  </td>
}

export default ActionCell;
