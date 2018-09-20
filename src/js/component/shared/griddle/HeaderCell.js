import React from 'react';

const HeaderCell = (props) =>
{
  return (
    <th
      className={props.classes}
      data-key={props.indexKey}
      style={props.styles}
      onClick={props.updateColumnSort}
    >
      {props.text}
    </th>
  );
}

export default HeaderCell;