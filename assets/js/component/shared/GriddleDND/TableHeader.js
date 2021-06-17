import React from 'react';
import classnames from 'classnames';
import HeaderCell from './HeaderCell';
import ActionHeaderCell from './ActionHeaderCell';

const TableHeader = ({
  headers,
  enableBulkActions,
  enableDragNDrop,
  toggleAllRowCheckboxes,
  updateColumnSort,
  sortKey,
  sortOrder,
  toggleAllCheckbox
}) => {
  const headerCells = headers.map(header => {
    const classes = [];
    const styles = {};

    if (header.width)
      styles.width = header.width;

    let updateColumnSortFunc = undefined;
    if (header.sortable) {
      classes.push('sortable');
      updateColumnSortFunc = () => updateColumnSort(header.key);

      if (sortKey == header.key)
        classes.push('sortable-' + sortOrder)
    }

    if (header.primary)
      classes.push('ccgriddle-column-primary');

    return <HeaderCell
      key={header.key}
      data={header.title}
      classes={classnames(classes)}
      styles={styles}
      updateColumnSort={updateColumnSortFunc}
    />
  });

  headerCells.unshift(<ActionHeaderCell
    key="header-checkbox"
    toggleAllRowCheckboxes={toggleAllRowCheckboxes}
    enableDragNDrop={enableDragNDrop}
    enableBulkActions={enableBulkActions}
    toggleAllCheckbox={toggleAllCheckbox}
  />);

  return <thead>
    <tr>
      {headerCells}
    </tr>
  </thead>
}

export default TableHeader;
