import React from 'react';
import classnames from 'classnames';

const Button = ({classes, title, onClick}) =>
{
  return (
    <button className={classnames(classes)} onClick={onClick}>{title}</button>
  );
}

export default Button;
