import React from 'react';
import PageHandle from './PageHandle';

const Paging = (props) =>
{
  const {
    currentPage,
    totalPages,
    onChangePage
  } = props;

  const pageHandleNodes = [];

  if (totalPages > 1)
    for (let i = 1; i <= totalPages; i++)
      pageHandleNodes.push(
        <PageHandle
          key={i}
          page={i}
          selected={currentPage == i}
          onChangePage={onChangePage}
        />
      );

  return (
    <div className="utv-gallery-paging">
      {pageHandleNodes}
    </div>
  );
}

export default Paging;
