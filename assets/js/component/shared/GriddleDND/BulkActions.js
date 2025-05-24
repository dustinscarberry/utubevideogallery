const BulkActions = ({
  actionData,
  bulkAction,
  updateBulkAction,
  runBulkAction
}) => {
  // set options
  const optionNodes = actionData.options.map((option) => {
    return <option key={option.value} value={option.value}>{option.name}</option>;
  });

  optionNodes.unshift(<option key={-1} value="">Bulk Actions</option>);

  return <div className="ccgriddle-table-bulk-actions">
    <select className="form-control" value={bulkAction} onChange={updateBulkAction}>
      {optionNodes}
    </select>
    <button className="button" onClick={runBulkAction}>Apply</button>
  </div>
}

export default BulkActions;
