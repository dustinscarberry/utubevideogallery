import React from 'react';
import Iframe from './Iframe';
import classnames from 'classnames';

const ResponsiveIframe = (props) =>
{
  const {
    src,
    classes
  } = props;

  return (
    <div className={classnames('utv-flexvideo utv-flexvideo-16x9', classes)}>
      <Iframe src={src}/>
    </div>
  );
}

export default ResponsiveIframe;
