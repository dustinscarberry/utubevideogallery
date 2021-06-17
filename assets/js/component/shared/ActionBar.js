import React from 'react';
import PropTypes from 'prop-types';

const ActionBar = ({children}) => {
  return <div className="utv-actionbar">{children}</div>
}

ActionBar.propTypes = {
  children: PropTypes.node
}

export default ActionBar;
