import React from 'react';

const PublishedIcon = ({isPublished, togglePublishStatus}) => {
  if (isPublished)
    return <i
      onClick={togglePublishStatus}
      className="utv-published-icon utv-is-clickable far fa-check-circle"
    ></i>
  else
    return <i
      onClick={togglePublishStatus}
      className="utv-unpublished-icon utv-is-clickable far fa-times-circle"
    ></i>
}

export default PublishedIcon;
