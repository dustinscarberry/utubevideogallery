import React from 'react';
import HeaderCell from './HeaderCell';
import HeaderCheckboxCell from './HeaderCheckboxCell';

const TableHeader = (props) =>
{
  const {
    headers,
    enableBulkActions,
    toggleAllRowCheckboxes,
    updateColumnSort,
    sortKey,
    sortOrder
  } = props;

  let headerCells = [];

  headerCells = headers.map(header =>
  {
    let classArray = [];
    let styles = {};
    let updateColumnSortFunc = undefined;

    if (header.width)
      styles.width = header.width;

    if (header.sortable)
    {
      classArray.push('sortable');
      updateColumnSortFunc = () => updateColumnSort(header.key);
      
      if (sortKey == header.key)
        classArray.push('sortable-' + sortOrder)
    }

    return (<HeaderCell
      key={header.key}
      data={header.title}
      classArray={classArray}
      styles={styles}
      updateColumnSort={updateColumnSortFunc}
    />);
  });

  if (enableBulkActions)
    headerCells.unshift(<HeaderCheckboxCell
      key="header-checkbox"
      toggleAllRowCheckboxes={toggleAllRowCheckboxes}
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
