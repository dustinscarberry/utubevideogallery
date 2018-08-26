import React from 'react';
import PageHandle from './PageHandle';

const Paging = ({currentPage, totalPages, onChangePage}) =>
{
  let pageHandles = [];

  for (let i = 1; i <= totalPages; i++)
    pageHandles.push(
      <PageHandle
        key={i}
        page={i}
        selected={currentPage == i ? true : false}
        onChangePage={onChangePage}
      />
    );

  return (
    <div className="utv-video-panel-paging">
      {pageHandles}
    </div>
  );
}

export default Paging;
