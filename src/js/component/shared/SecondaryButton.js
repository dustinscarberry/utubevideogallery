import React from 'react';
import Button from './Button';

const SecondaryButton = (props) =>
{
  const {
    title,
    onClick
  } = props;

  return <Button
    classes="button-secondary"
    onClick={onClick}
    title={title}
  />;
}

export default SecondaryButton;
