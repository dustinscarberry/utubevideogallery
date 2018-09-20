import React from 'react';
import classnames from 'classnames';

const SubmitButton = ({classes, title}) =>
{
  return (
    <input type="submit" value={title} className={classnames(classes)}/>
  );
}

export default SubmitButton;
