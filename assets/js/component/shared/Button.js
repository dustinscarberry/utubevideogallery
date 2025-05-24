import classnames from 'classnames';
import PropTypes from 'prop-types';

const Button = ({classes, title, onClick}) => {
  return <button className={classnames(classes)} onClick={onClick}>{title}</button>
}

Button.propTypes = {
  classes: PropTypes.array,
  title: PropTypes.string,
  onClick: PropTypes.func
}

export default Button;
