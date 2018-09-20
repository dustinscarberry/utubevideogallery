import React from 'react';

const Breadcrumbs = ({crumbs}) =>
{/*
  let crumbsNodes = [];

  for (let index, crumb of crumbs)
  {
    if (index != 0)
      crumbsNodes += <i className="utv-breadcrumb-divider fas fa-chevron-right"></i>;

    if (crumb.onClick)
      crumbsNodes += <a className="utv-breadcrumb-link" onClick={crumb.onClick}>{crumb.text}</a>;
    else
      crumbsNodes += <span className="utv-breadcrumb-static">{crumb.text}</span>
  }*/

  let crumbsNodes = undefined;

  return (
    <div className="utv-breadcrumbs">
      {crumbsNodes}
    </div>
  );
}

export default Breadcrumbs;
