import React from 'react';
import Iframe from './Iframe';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const ResponsiveIframe = ({src, classes}) =>
{
  return (
    <div className={classnames('utv-flexvideo utv-flexvideo-16x9', classes)}>
      <Iframe src={src}/>
    </div>
  );
}

ResponsiveIframe.propTypes = {
  src: PropTypes.string,
  classes: PropTypes.array
}

export default ResponsiveIframe;
