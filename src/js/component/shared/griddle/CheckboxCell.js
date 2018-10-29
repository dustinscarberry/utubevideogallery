import React from 'react';

const CheckboxCell = (props) =>
{
  return (
    <td>
      <input
        type="checkbox"
        checked={props.isChecked}
        onClick={() => props.toggleRowCheckbox(props.dataIndex)}
      />
    </td>
  );
}

export default CheckboxCell;
