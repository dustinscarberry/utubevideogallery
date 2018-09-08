import React from 'react';

const Column = ({className, children}) =>
{
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export default Column;
