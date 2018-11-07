import React from 'react';

const HeaderCheckboxCell = (props) =>
{
  const {
    toggleAllRowCheckboxes
  } = props;

  return (
    <th className="ccgriddle-checkbox-header">
      <input type="checkbox" onClick={toggleAllRowCheckboxes}/>
    </th>
  );
}

export default HeaderCheckboxCell;
