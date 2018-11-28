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

  for (let i = 1; i <= totalPages; i++)
    pageHandleNodes.push(
      <PageHandle
        key={i}
        page={i}
        selected={currentPage == i ? true : false}
        onChangePage={onChangePage}
      />
    );

  return (
    <div className="utv-video-panel-paging">
      {pageHandleNodes}
    </div>
  );
}

export default Paging;
