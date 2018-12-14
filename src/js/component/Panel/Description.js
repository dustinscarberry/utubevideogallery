import React from 'react';

const Description = (props) =>
{
  const {
    text
  } = props;

  if (!text)
    return null;
    
  return (
    <div className="utv-panel-description">
      {text}
    </div>
  );
}

export default Description;
