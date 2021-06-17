import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const FormField = ({classes, children}) => {
  return <div className={classnames('utv-formfield', classes)}>
    {children}
  </div>
}

FormField.propTypes = {
  classes: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  children: PropTypes.node
}

export default FormField;
