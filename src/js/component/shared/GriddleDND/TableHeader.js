import React from 'react';
import HeaderCell from './HeaderCell';
import ActionHeaderCell from './ActionHeaderCell';

const TableHeader = (props) =>
{
  const {
    headers,
    enableBulkActions,
    enableDragNDrop,
    toggleAllRowCheckboxes,
    updateColumnSort,
    sortKey,
    sortOrder,
    toggleAllCheckbox
  } = props;

  const headerCells = headers.map(header =>
  {
    const classes = [];
    const styles = {};
    let updateColumnSortFunc = undefined;

    if (header.width)
      styles.width = header.width;

    if (header.sortable)
    {
      classes.push('sortable');
      updateColumnSortFunc = () => updateColumnSort(header.key);

      if (sortKey == header.key)
        classes.push('sortable-' + sortOrder)
    }

    if (header.primary)
      classes.push('ccgriddle-column-primary');

    return (<HeaderCell
      key={header.key}
      data={header.title}
      classes={classes}
      styles={styles}
      updateColumnSort={updateColumnSortFunc}
    />);
  });

  headerCells.unshift(<ActionHeaderCell
    key="header-checkbox"
    toggleAllRowCheckboxes={toggleAllRowCheckboxes}
    enableDragNDrop={enableDragNDrop}
    enableBulkActions={enableBulkActions}
    toggleAllCheckbox={toggleAllCheckbox}
  />);

  return (
    <thead>
      <tr>
        {headerCells}
      </tr>
    </thead>
  );
}

export default TableHeader;
