import React from 'react';
import classnames from 'classnames';

const URLInput = ({classes, name, value, required, onChange}) =>
{
  return <input
    className={classnames(classes)}
    style={{'display': 'block'}}
    type="url"
    name={name}
    value={value}
    onChange={onChange}
    required={required}
  />;
}

export default URLInput;
