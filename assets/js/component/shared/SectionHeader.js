import React from 'react';
import PropTypes from 'prop-types';

const SectionHeader = ({text}) => {
  return <h3 className="utv-section-header">{text}</h3>;
}

SectionHeader.propTypes = {
  text: PropTypes.string
}

export default SectionHeader;
