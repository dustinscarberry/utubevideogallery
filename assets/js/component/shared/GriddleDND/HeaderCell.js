import React from 'react';

const HeaderCell = (props) =>
{
  const {
    data,
    classes,
    styles,
    updateColumnSort
  } = props;

  return (
    <th
      className={classes.join(' ')}
      style={styles}
      onClick={updateColumnSort}
    >
      {data}
    </th>
  );
}

export default HeaderCell;
