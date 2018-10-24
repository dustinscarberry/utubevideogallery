import React from 'react';

const CheckboxCell = (props) =>
{
  return (
    <td>
      <input
        type="checkbox"
        onClick={() => console.log(props.idKey)}
      />
    </td>
  );
}

export default CheckboxCell;
