import React from 'react';

const BreadCrumb = ({albumName, onResetAlbum}) =>
{
  let crumbs = undefined;

  if (!albumName)
    crumbs = <div className="utv-breadcrumb">
      <span className="utv-albumcrumb">Albums</span>
    </div>;
  else
    crumbs = <div className="utv-breadcrumb">
      <span onClick={onResetAlbum}>Albums</span>
      <span className="utv-albumcrumb"> | {albumName}</span>
    </div>;

  return crumbs;
}

export default BreadCrumb;
