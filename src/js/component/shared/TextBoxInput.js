import React from 'react';
import classnames from 'classnames';

const TextBoxInput = (props) =>
{
  const {
    classes,
    name,
    value,
    required,
    disabled,
    onChange
  } = props;

  return <textarea
    className={classnames(classes)}
    style={{'display': 'block'}}
    name={name}
    value={value}
    onChange={onChange}
    required={required}
    disabled={disabled}
  />;
}

export default TextBoxInput;
