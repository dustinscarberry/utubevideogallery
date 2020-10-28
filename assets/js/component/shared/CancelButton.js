import React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';

const CancelButton = ({title, onClick}) => {
  return <Button
    classes={["utv-cancel"]}
    onClick={onClick}
    title={title}
  />;
}

CancelButton.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func
}

export default CancelButton;
