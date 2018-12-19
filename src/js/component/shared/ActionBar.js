import React from 'react';

const ActionBar = (props) =>
{
  return (
    <div className="utv-actionbar">
      {props.children}
    </div>
  );
}

export default ActionBar;
