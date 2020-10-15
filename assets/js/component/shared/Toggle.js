import React from 'react';
import PropTypes from 'prop-types';

const Toggle = ({name, value, onChange, text}) =>
{
  return (
    <div className="ui toggle checkbox">
      <input type="checkbox" name={name} checked={value} onChange={onChange}/>
      <label></label>
    </div>
  );
}

export default Toggle;
