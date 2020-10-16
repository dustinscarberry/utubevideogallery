import React from 'react';

const HeaderCell = ({data, classes, styles, updateColumnSort}) => {
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
