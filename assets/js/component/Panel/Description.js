import React from 'react';

const Description = (props) =>
{
  const {
    text
  } = props;

  //return null if no text or disabled
  if (!text || !utvJSData.setting.showVideoDescription)
    return null;

  return (
    <div className="utv-panel-description">
      {text}
    </div>
  );
}

export default Description;
