import React from 'react';

const HeaderCheckboxCell = (props) =>
{
  return (
    <th className="ccgriddle-checkbox-header">
      <input type="checkbox" onClick={props.toggleAllRowCheckboxes}/>
    </th>
  );
}

export default HeaderCheckboxCell;
