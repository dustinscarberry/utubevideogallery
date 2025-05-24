import PropTypes from 'prop-types';
import classnames from 'classnames';

const UserFeedback = ({message, type}) => {
  if (!message || !type)
    return null;

  const classes = ['notice'];
  if (type == 'success')
    classes.push('notice-success');
  else if (type == 'warning')
    classes.push('notice-warning');
  else if (type == 'info')
    classes.push('notice-info');
  else
    classes.push('notice-error');

  return <div className={classnames(classes)}>
    <p>{message}</p>
  </div>
}

UserFeedback.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string
}

export default UserFeedback;
