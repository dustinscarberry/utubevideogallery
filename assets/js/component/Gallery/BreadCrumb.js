import React from 'react';

const Breadcrumb = ({albumName, changeAlbum}) => {
  let crumbNodes;

  if (!albumName)
    return (
      <div className="utv-breadcrumb">
        <span className="utv-albumcrumb">{utvJSData.localization.albums}</span>
      </div>
    );
  else
    return (
      <div className="utv-breadcrumb">
        <span className="utv-albumscrumb" onClick={() => changeAlbum(undefined)}>{utvJSData.localization.albums}</span>
        <span className="utv-albumcrumb"> | {albumName}</span>
      </div>
    );
}

export default Breadcrumb;
