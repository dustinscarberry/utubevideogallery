import React from 'react';
import classnames from 'classnames';

const Iframe = ({src, classes}) =>
{
  return (
    <iframe
      src={src}
      className={classnames(classes)}
      allowFullScreen>
    </iframe>
  );
}

export default Iframe;
