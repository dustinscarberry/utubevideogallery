import React from 'react';

const Breadcrumb = ({albumName, changeAlbum}) => {
  let crumbNodes;

  if (!albumName)
    crumbNodes = <div className="utv-breadcrumb">
      <span className="utv-albumcrumb">{utvJSData.localization.albums}</span>
    </div>;
  else
    crumbNodes = <div className="utv-breadcrumb">
      <span className="utv-albumscrumb" onClick={() => changeAlbum(undefined)}>{utvJSData.localization.albums}</span>
      <span className="utv-albumcrumb"> | {albumName}</span>
    </div>;

  return crumbNodes;
}

export default Breadcrumb;
