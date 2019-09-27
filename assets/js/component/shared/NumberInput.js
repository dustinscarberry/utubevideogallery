import React from 'react';
import classnames from 'classnames';

const NumberInput = ({classes, name, value, required, onChange}) =>
{
  return <input
    className={classnames(classes)}
    style={{'display': 'block'}}
    type="number"
    name={name}
    value={value}
    onChange={onChange}
    required={required}
  />;
}

export default NumberInput;
