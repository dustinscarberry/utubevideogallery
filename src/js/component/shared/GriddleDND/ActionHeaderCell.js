import React from 'react';

const ActionHeaderCell = (props) =>
{
  const {
    toggleAllRowCheckboxes,
    enableDragNDrop,
    enableBulkActions
  } = props;

  const headerClasses = ['ccgriddle-action-header'];
  let checkboxNode = undefined;

  if (enableDragNDrop)
    headerClasses.push('ccgriddle-action-dragndrop')

  if (enableBulkActions)
  {
    headerClasses.push('ccgriddle-action-bulkaction');
    checkboxNode = <input type="checkbox" onClick={toggleAllRowCheckboxes}/>;
  }

  return (
    <th className={headerClasses.join(' ')}>
      {checkboxNode}
    </th>
  );
}

export default ActionHeaderCell;
