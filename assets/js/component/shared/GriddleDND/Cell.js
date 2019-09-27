import React from 'react';
import classnames from 'classnames';

const Cell = (props) =>
{
  const {
    data,
    classes,
    columnName
  } = props;

  return <td className={classnames(classes)} data-columnname={columnName}>{data}</td>;
}

export default Cell;
