import React from 'react';
import HeaderCell from './HeaderCell';
import HeaderCheckboxCell from './HeaderCheckboxCell';

const TableHeader = (props) =>
{
  let headers = [];

  headers = props.headers.map(x =>
  {
    let classes = '';
    let styles = {};

    if (x.width)
      styles.width = x.width;

    if (x.sortable)
    {
      if (x.sortDirection != '')
        classes = 'sortable sortable-' + x.sortDirection;
      else
        classes = 'sortable';

      return (<HeaderCell key={x.key} data={x.title} classes={classes} styles={styles} updateColumnSort={props.updateColumnSort} indexKey={x.key}/>);
    }
    else
      return (<HeaderCell key={x.key} styles={styles} data={x.title}/>);
  });

  if (props.enableBulkActions)
    headers.unshift(<HeaderCheckboxCell key="header-checkbox" toggleAllRowCheckboxes={props.toggleAllRowCheckboxes}/>);

  return (
    <thead>
      <tr>
        {headers}
      </tr>
    </thead>
  );
}

export default TableHeader;
