import React from 'react';
import Button from './Button';

const SecondaryButton = ({title, onClick}) =>
{
  return <Button
    classes="button-secondary"
    onClick={onClick}
    title={title}
  />;
}

export default SecondaryButton;
