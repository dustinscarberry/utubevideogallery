import React from 'react';
import PropTypes from 'prop-types';

const AlbumThumbnail = ({title, image, value, onChangeAlbum}) => {
  return <div className="utv-thumbnail utv-album" onClick={() => onChangeAlbum(value)}>
    <img src={image}/>
    <span>{title}</span>
  </div>
}

AlbumThumbnail.propTypes = {
  title: PropTypes.string,
  image: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChangeAlbum: PropTypes.func
}

export default AlbumThumbnail;
