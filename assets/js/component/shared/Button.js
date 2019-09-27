import React from 'react';
import classnames from 'classnames';

const Button = (props) =>
{
  const {
    classes,
    title,
    onClick
  } = props;

  return (
    <button className={classnames(classes)} onClick={onClick}>{title}</button>
  );
}

export default Button;
