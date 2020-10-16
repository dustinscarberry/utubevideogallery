import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const InfoLine = ({text, icon}) => {
  const classes = ['utv-infoline'];

  if (icon) {
    classes.push('utv-status');

    if (icon == 'active')
      classes.push('utv-status-active');
    else if (icon == 'inactive')
      classes.push('utv-status-inactive');
    else if (icon == 'warning')
      classes.push('utv-status-warning');
  }

  return (
    <span className={classnames(classes)}>{text}</span>
  );
}

InfoLine.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string
}

export default InfoLine;
