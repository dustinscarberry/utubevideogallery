import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const Card = ({classes, children}) => {
  return <div className={classnames('utv-card', classes)}>
    {children}
  </div>
}

Card.propTypes = {
  classes: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  children: PropTypes.node
}

export default Card;
