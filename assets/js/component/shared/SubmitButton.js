import React from 'react';
import PropTypes from 'prop-types';

const SubmitButton = ({title}) => {
  return <input type="submit" value={title} className="button-primary"/>;
}

SubmitButton.propTypes = {
  title: PropTypes.string
}

export default SubmitButton;
