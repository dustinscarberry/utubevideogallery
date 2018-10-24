import React from 'react';

const Pagination = (props) =>
{
  let previousButton = undefined;
  let nextButton = undefined;
  let firstButton = undefined;
  let lastButton = undefined;

  let maxPage = Math.ceil(props.recordCount / props.pageSize) || undefined;

  if (props.page == 1)
  {
    previousButton = <button className="ccgriddle-table-pagination-previous" disabled></button>
    firstButton = <button className="ccgriddle-table-pagination-first" disabled></button>
  }
  else
  {
    previousButton = <button className="ccgriddle-table-pagination-previous" onClick={() => props.updatePage(props.page - 1)}></button>
    firstButton = <button className="ccgriddle-table-pagination-first" onClick={() => props.updatePage(1)}></button>
  }

  if (props.page == maxPage)
  {
    nextButton = <button className="ccgriddle-table-pagination-next" disabled></button>
    lastButton = <button className="ccgriddle-table-pagination-last" disabled></button>
  }
  else
  {
    nextButton = <button className="ccgriddle-table-pagination-next" onClick={() => props.updatePage(props.page + 1)}></button>
    lastButton = <button className="ccgriddle-table-pagination-last" onClick={() => props.updatePage(maxPage)}></button>
  }

  return (
    <div className="ccgriddle-table-pagination">
      {firstButton}
      {previousButton}
      <input
        type="number"
        className="form-control"
        min="1"
        max={maxPage}
        value={props.page}
        onChange={props.updatePageLabel}
        onBlur={props.blurPageLabel}
      />
      <span>of {maxPage}</span>
      {nextButton}
      {lastButton}
    </div>
  );
}

export default Pagination;
