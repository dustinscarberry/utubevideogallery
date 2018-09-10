import React from 'react';

const PageRecords = (props) =>
{
  let options = [2, 5, 10, 25, 50, 100].map(x => <option key={x} value={x}>{x}</option>);

  return (
    <div className="ccgriddle-table-page-records">
      <span>Display</span>
      <select value={props.pageSize} onChange={props.updatePageSize} className="form-control">
        {options}
      </select>
      <span>{props.recordLabel}</span>
    </div>
  );
}

export default PageRecords;
