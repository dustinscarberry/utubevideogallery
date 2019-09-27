import React from 'react';

const UserFeedback = (props) =>
{
  const {
    message,
    type
  } = props;

  if (!message || !type)
    return null;

  let classes = ['notice'];

  if (type == 'success')
    classes.push('notice-success');
  else if (type == 'warning')
    classes.push('notice-warning');
  else if (type == 'info')
    classes.push('notice-info');
  else
    classes.push('notice-error');

  return (
    <div className={classes.join(' ')}>
      <p>{message}</p>
    </div>
  );
}

export default UserFeedback;
