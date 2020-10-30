import React from 'react';
import PropTypes from 'prop-types';

const FieldHint = ({text}) => {
  return <span className="utv-hint">{text}</span>;
}

FieldHint.propTypes = {
  text: PropTypes.string
}

export default FieldHint;
