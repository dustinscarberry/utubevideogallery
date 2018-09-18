import React from 'react';
import classnames from 'classnames';

const NumberInput = ({classes, name, value, onChange}) =>
{
  return <input
    className={classnames(classes)}
    style={{'display': 'block'}}
    type="number"
    name={name}
    value={value}
    onChange={onChange}
  />;
}

export default NumberInput;
