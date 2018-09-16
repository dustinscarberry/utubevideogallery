import React from 'react';

const Toggle = (props) =>
{
  return (
    <div className="ui toggle checkbox">
      <input type="checkbox" name={props.name} checked={props.checked} onChange={props.onChange}/>
      <label>{props.text}</label>
    </div>
  );
}

export default Toggle;
