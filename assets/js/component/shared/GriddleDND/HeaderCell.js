import React from 'react';
import classnames from 'classnames';

const HeaderCell = ({data, classes, styles, updateColumnSort}) => {
  return <th className={classnames(classes)} style={styles} onClick={updateColumnSort}>
    {data}
  </th>
}

export default HeaderCell;
