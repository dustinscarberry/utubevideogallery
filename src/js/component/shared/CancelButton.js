import React from 'react';
import Button from './Button';

const CancelButton = (props) =>
{
  const {
    title,
    onClick
  } = props;

  return <Button
    classes="utv-cancel"
    onClick={onClick}
    title={title}
  />;
}

export default CancelButton;
