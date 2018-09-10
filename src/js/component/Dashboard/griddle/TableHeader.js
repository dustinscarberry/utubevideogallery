import React from 'react';
import HeaderCell from './HeaderCell';

const TableHeader = (props) =>
{
  const headers = props.headers.map(x =>
  {
    let classes = '';

    if (x.sortable)
    {
      if (x.sortDirection != '')
        classes = 'sortable sortable-' + x.sortDirection;
      else
        classes = 'sortable';

      return (<HeaderCell key={x.key} text={x.title} classes={classes} updateColumnSort={props.updateColumnSort} indexKey={x.key}/>);
    }
    else
      return (<HeaderCell key={x.key} text={x.title}/>);
  });

  return (
    <thead>
      <tr>
        {headers}
      </tr>
    </thead>
  );
}

export default TableHeader;
