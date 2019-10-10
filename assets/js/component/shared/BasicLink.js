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
    className={classnames(classes)}
  >
    {text}
    {children}
  </a>
}

export default BasicLink;
