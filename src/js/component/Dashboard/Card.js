import React from 'react';

const Card = (props) =>
{
  return (
    <div className="utv-card">
      {props.children}
    </div>
  );
}

export default Card;
