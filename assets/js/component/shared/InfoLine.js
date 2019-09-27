import React from 'react';

const InfoLine = (props) =>
{
  const {
    text,
    icon
  } = props;

  let classes = ['utv-infoline'];

  if (icon)
  {
    classes.push('utv-status');

    if (icon == 'active')
      classes.push('utv-status-active');
    else if (icon == 'inactive')
      classes.push('utv-status-inactive');
    else if (icon == 'warning')
      classes.push('utv-status-warning');
  }

  return (
    <span className={classes.join(' ')}>{text}</span>
  );
}

export default InfoLine;
