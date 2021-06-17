import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextInput = ({classes, name, value, required, disabled, onChange}) => {
  return <input
    className={classnames(classes)}
    style={{'display': 'block'}}
    type="text"
    name={name}
    value={value}
    onChange={onChange}
    required={required}
    disabled={disabled}
  />
}

TextInput.propTypes = {
  classes: PropTypes.array,
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func
}

export default TextInput;
