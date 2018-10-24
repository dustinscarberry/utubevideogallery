import React from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

const Table = (props) =>
{
  let classes = '';
  if (props.loading)
    classes = 'ccgriddle-table is-loading';
  else
    classes = 'ccgriddle-table';

  return (
    <table className={classes}>
      <TableHeader
        headers={props.headers}
        updateColumnSort={props.updateColumnSort}
        useBulkActions={props.useBulkActions}
      />
      <TableBody
        headers={props.headers}
        data={props.data}
        page={props.page}
        pageSize={props.pageSize}
        useBulkActions={props.useBulkActions}
      />
    </table>
  );
}

export default Table;
