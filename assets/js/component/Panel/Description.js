const Description = ({text}) => {
  if (!text || !utvJSData.setting.showVideoDescription)
    return null;

  return <div className="utv-panel-description">{text}</div>
}

export default Description;
