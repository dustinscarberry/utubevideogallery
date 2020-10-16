import React from 'react';

const Description = ({text}) => {
  // return null if no text or disabled
  if (!text || !utvJSData.setting.showVideoDescription)
    return null;

  return <div className="utv-panel-description">{text}</div>;
}

export default Description;
