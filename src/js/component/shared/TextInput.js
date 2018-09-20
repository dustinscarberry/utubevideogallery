import React from 'react';
import classnames from 'classnames';

const TextInput = ({classes, name, value, onChange}) =>
{
  return <input
    className={classnames(classes)}
    style={{'display': 'block'}}
    type="text"
    name={name}
    value={value}
    onChange={onChange}
    required
  />;
}

export default TextInput;
