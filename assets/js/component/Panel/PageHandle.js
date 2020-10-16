import React from 'react';

const PageHandle = ({page, selected, onChangePage}) => {
  const handleClasses = ['utv-panel-paging-handle'];

  if (selected)
    handleClasses.push('utv-panel-paging-active');

  return (
    <span className={handleClasses.join(' ')} onClick={() => onChangePage(page)}>
      {page}
    </span>
  );
}

export default PageHandle;
