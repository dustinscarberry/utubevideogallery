import React from 'react';

const HeaderCell = (props) =>
{
  const {
    data,
    classArray,
    styles,
    updateColumnSort
  } = props;

  return (
    <th
      className={classArray.join(' ')}
      style={styles}
      onClick={updateColumnSort}
    >
      {data}
    </th>
  );
}

export default HeaderCell;
