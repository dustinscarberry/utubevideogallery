import React from 'react';

const Cell = (props) =>
{
  const { data } = props;

  return <td>{data}</td>;
}

export default Cell;
