import React from 'react';
import PropTypes from 'prop-types';

const Columns = ({children}) =>
{
  return (
    <div className="utv-columns">
      {children}
    </div>
  );
}

Columns.propTypes = {
  children: PropTypes.node
}

export default Columns;
