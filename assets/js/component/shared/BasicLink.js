import classnames from 'classnames';
import PropTypes from 'prop-types';

const BasicLink = ({classes, text, children, onClick}) => {
  return <a
    onClick={onClick}
    className={classnames(classes)}
  >
    {text}
    {children}
  </a>
}

BasicLink.propTypes = {
  classes: PropTypes.array,
  text: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func
}

export default BasicLink;
