import React from 'react';
import classnames from 'classnames';

const FormField = ({classes, children}) =>
{
  return (
    <div className={classnames('utv-formfield', classes)}>
      {children}
    </div>
  );
}

export default FormField;
