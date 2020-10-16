import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const NumberInput = ({classes, name, value, required, onChange}) => {
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

NumberInput.propTypes = {
  classes: PropTypes.array,
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  required: PropTypes.bool,
  onChange: PropTypes.func
}

export default NumberInput;
