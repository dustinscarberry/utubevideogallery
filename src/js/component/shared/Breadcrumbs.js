import React from 'react';

const Breadcrumbs = ({crumbs}) =>
{
  let crumbsNodes = [];

  for (let i = 0; i < crumbs.length; i++)
  {
    //add separater
    if (i != 0)
      crumbsNodes.push(<i className="utv-breadcrumb-divider fas fa-chevron-right"></i>);

    //add breadcrumb
    if (crumbs[i].onClick)
      crumbsNodes.push(<a className="utv-breadcrumb-link" onClick={crumbs[i].onClick}>{crumbs[i].text}</a>);
    else
      crumbsNodes.push(<span className="utv-breadcrumb-static">{crumbs[i].text}</span>);
  }

  return (
    <div className="utv-breadcrumbs">
      {crumbsNodes}
    </div>
  );
}

export default Breadcrumbs;
