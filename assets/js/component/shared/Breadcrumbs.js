import PropTypes from 'prop-types';

const Breadcrumbs = ({crumbs}) => {
  const crumbsNodes = [];

  for (let i = 0; i < crumbs.length; i++) {
    // add separater
    if (i != 0)
      crumbsNodes.push(<i key={'chevron' + i} className="utv-breadcrumb-divider fas fa-chevron-right"></i>);

    // add breadcrumb
    if (crumbs[i].onClick)
      crumbsNodes.push(<a key={i} className="utv-breadcrumb-link" onClick={crumbs[i].onClick}>{crumbs[i].text}</a>);
    else
      crumbsNodes.push(<span key={i} className="utv-breadcrumb-static">{crumbs[i].text}</span>);
  }

  return <div className="utv-breadcrumbs">
    {crumbsNodes}
  </div>
}

Breadcrumbs.propTypes = {
  crumbs: PropTypes.array
}

export default Breadcrumbs;
