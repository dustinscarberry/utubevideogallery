import React from 'react';
import classnames from 'classnames';

const Card = ({classes, children}) =>
{
  return (
    <div className={classnames('utv-card', classes)}>
      {children}
    </div>
  );
}

export default Card;
