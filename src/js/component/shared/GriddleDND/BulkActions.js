import React from 'react';

const BulkActions = (props) =>
{
  const {
    actionData,
    bulkAction,
    updateBulkAction,
    runBulkAction
  } = props;

  const optionNodes = actionData.options.map((option) => {
    return <option key={option.value} value={option.value}>{option.name}</option>;
  });

  optionNodes.unshift(<option key={-1} value="">Bulk Actions</option>);

  return (
    <div className="ccgriddle-table-page-actions">
      <select className="form-control" value={bulkAction} onChange={updateBulkAction}>
        {optionNodes}
      </select>
      <button onClick={runBulkAction}>Apply</button>
    </div>
  );
}

export default BulkActions;
