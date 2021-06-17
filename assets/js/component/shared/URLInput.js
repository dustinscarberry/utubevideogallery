import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const URLInput = ({classes, name, value, required = false, onChange}) => {
  return <input
    className={classnames(classes)}
    style={{'display': 'block'}}
    type="url"
    name={name}
    value={value}
    onChange={onChange}
    required={required}
  />
}

URLInput.propTypes = {
  classes: PropTypes.array,
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  required: PropTypes.bool,
  onChange: PropTypes.func
}

export default URLInput;
