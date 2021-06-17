import React from 'react';
import PropTypes from 'prop-types';

const Column = ({className, children}) => {
  return <div className={className}>{children}</div>
}

Column.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

export default Column;
