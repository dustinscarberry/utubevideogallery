import React from 'react';
import classnames from 'classnames';

const Iframe = (props) =>
{
  const {
    src,
    classes
  } = props;

  return (
    <iframe
      src={src}
      className={classnames(classes)}
      allowFullScreen>
    </iframe>
  );
}

export default Iframe;
