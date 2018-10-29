import React from 'react';

const BulkActions = (props) =>
{
  let options = props.actionData.options.map((e) => {
    return <option key={e.value} value={e.value}>{e.name}</option>;
  });

  return (
    <div className="ccgriddle-table-page-actions">
      <select className="form-control" value={props.bulkAction} onChange={props.updateBulkAction}>
        {options}
      </select>
      <button onClick={props.runBulkAction}>Apply</button>
    </div>
  );
}

export default BulkActions;
