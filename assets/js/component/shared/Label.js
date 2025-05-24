import PropTypes from 'prop-types';

const Label = ({text}) => {
  return <label>{text}</label>
}

Label.propTypes = {
  text: PropTypes.string
}

export default Label;
