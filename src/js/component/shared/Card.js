import React from 'react';

const Card = (props) =>
{
  let classes = 'utv-card ' + props.className;

  return (
    <div className={classes}>
      {props.children}
    </div>
  );
}

export default Card;
