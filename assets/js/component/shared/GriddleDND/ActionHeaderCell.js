import React from 'react';
import classnames from 'classnames';

const ActionHeaderCell = ({
  toggleAllRowCheckboxes,
  enableDragNDrop,
  enableBulkActions,
  toggleAllCheckbox
}) => {
  return <th className={classnames({
    'ccgriddle-action-header': true,
    'ccgriddle-column-primary': true,
    'ccgriddle-action-dragndrop': enableDragNDrop,
    'ccgriddle-action-bulkaction': enableBulkActions
  })}>
    {enableBulkActions &&
      <input
        type="checkbox"
        checked={toggleAllCheckbox}
        onChange={toggleAllRowCheckboxes}
      />
    }
  </th>
}

export default ActionHeaderCell;
