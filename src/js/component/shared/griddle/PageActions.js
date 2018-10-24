import React from 'react';

const PageRecords = ({bulkActions}) =>
{
  let options = bulkActions.map((e) => {
    return e.title;
  });

  return (
    <div className="ccgriddle-table-page-actions">
      <select className="form-control">
        {options}
      </select>
      <button>Apply</button>
    </div>
  );
}

export default PageActions;
