import React from 'react';
import PropTypes from 'prop-types';

const ThumbnailsGrid = ({className, children}) => {
  return <div className={className}>{children}</div>;
}

ThumbnailsGrid.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

export default ThumbnailsGrid;
