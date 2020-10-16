import React from 'react';
import PropTypes from 'prop-types';

const Pane = ({children}) => {
  return <div>{children}</div>;
}

Pane.propTypes = {
  children: PropTypes.node
}

export default Pane;
