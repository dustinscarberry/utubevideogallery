import React from 'react';
import classnames from 'classnames';

const BasicLink = (props) =>
{
  const {
    classes,
    onClick,
    text,
    children
  } = props;

  return <a
    onClick={onClick}
    href="javascript:void(0)"
    className={classnames(classes)}
  >
    {text}
    {children}
  </a>
}

export default BasicLink;
