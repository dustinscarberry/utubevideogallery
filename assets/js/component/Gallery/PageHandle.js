import React from 'react';
import classnames from 'classnames';

const PageHandle = ({page, selected, onChangePage}) => {
  return <span
    className={classnames(
      'utv-gallery-paging-handle',
      {'utv-gallery-paging-active': selected}
    )}
    onClick={() => onChangePage(page)}
  >
    {page}
  </span>
}

export default PageHandle;
