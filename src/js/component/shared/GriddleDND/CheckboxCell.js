import React from 'react';

const CheckboxCell = (props) =>
{
  const {
    isChecked,
    dataIndex,
    toggleRowCheckbox
  } = props;

  return (
    <td>
      <input
        type="checkbox"
        checked={isChecked}
        onClick={() => toggleRowCheckbox(dataIndex)}
      />
    </td>
  );
}

export default CheckboxCell;
