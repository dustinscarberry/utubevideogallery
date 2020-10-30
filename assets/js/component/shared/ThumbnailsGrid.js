import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const ThumbnailsGrid = ({classes, children}) => {
  return <div className={classnames(classes)}>{children}</div>;
}

ThumbnailsGrid.propTypes = {
  classes: PropTypes.array,
  children: PropTypes.node
}

export default ThumbnailsGrid;
