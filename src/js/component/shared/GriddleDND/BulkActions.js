import React from 'react';

const BulkActions = (props) =>
{
  const {
    actionData,
    bulkAction,
    updateBulkAction,
    runBulkAction
  } = props;

  let options = actionData.options.map((option) => {
    return <option key={option.value} value={option.value}>{option.name}</option>;
  });

  return (
    <div className="ccgriddle-table-page-actions">
      <select className="form-control" value={bulkAction} onChange={updateBulkAction}>
        {options}
      </select>
      <button onClick={runBulkAction}>Apply</button>
    </div>
  );
}

export default BulkActions;
