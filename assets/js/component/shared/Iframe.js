import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const Iframe = ({src, classes = []}) => {
  return <iframe
    src={src}
    className={classnames(classes)}
    allowFullScreen>
  </iframe>
}

Iframe.propTypes = {
  src: PropTypes.string,
  classes: PropTypes.array
}

export default Iframe;
