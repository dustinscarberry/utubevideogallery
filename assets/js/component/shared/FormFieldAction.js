import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const FormField = ({className, children}) => {
  return (
    <div className={classnames('utv-formfield', className)}>
      {children}
    </div>
  );
}

export default FormField;
