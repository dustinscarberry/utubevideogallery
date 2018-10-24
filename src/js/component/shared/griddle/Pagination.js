import React from 'react';

const Pagination = (props) =>
{
  let prevButton = undefined;
  let nextButton = undefined;
  let totalPages = Math.ceil(props.recordCount / props.pageSize) || undefined;

  if (props.page == 1)
    prevButton = <button className="btn btn-secondary" disabled>Previous</button>
  else
    prevButton = <button className="btn btn-secondary" onClick={props.updatePagePrevious}>Previous</button>

  if (props.page == totalPages)
    nextButton = <button className="btn btn-secondary" disabled>Next</button>
  else
    nextButton = <button className="btn btn-secondary" onClick={props.updatePageNext}>Next</button>

    prevButton = null;
    nextButton = null;

  return (
    <div className="ccgriddle-table-pagination">





      <span className="ccgriddle-table-pagination-first"></span>
      <span className="ccgriddle-table-pagination-previous"></span>
      <input type="number" className="form-control" min="1" max={totalPages} value={props.pageLabel} onChange={props.updatePageLabel} onBlur={props.blurPageLabel}/>
      <span>of {totalPages}</span>
      <span className="ccgriddle-table-pagination-next"></span>
      <span className="ccgriddle-table-pagination-last"></span>



      {prevButton}


      {nextButton}
    </div>
  );
}

export default Pagination;
