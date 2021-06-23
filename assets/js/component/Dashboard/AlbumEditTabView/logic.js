import axios from 'axios';

// fetch album
export const fetchAlbum = (albumID) => {
  return axios.get('/wp-json/utubevideogallery/v1/albums/' + albumID, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

// fetch galleries
export const fetchGalleries = () => {
  return axios.get('/wp-json/utubevideogallery/v1/galleries/', {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

// parse list of galleries to key value pairs
export const parseGalleriesData = (galleries) => {
  return galleries.map(gallery => {
    return {name: gallery.title, value: gallery.id};
  });
}

// fetch videos in album for thumbnails
export const fetchThumbnails = (albumID) => {
  return axios.get('/wp-json/utubevideogallery/v1/albums/' + albumID + '/videos');
}

//  parse list of videos from fetchThumbnails() for thumbnails selection
export const parseThumbnailsData = (videos) => {
  return videos.map(video => {
    return {thumbnail: video.thumbnail};
  });
}

// get clean [just slug] for thumbnail
export const getCleanThumbnail = (thumbnail) => {
  thumbnail = thumbnail.replace(utvJSData.thumbnailCacheDirectory, '');
  return thumbnail.replace('.jpg', '');
}

// update album
export const updateAlbum = (albumID, albumData, cleanedThumbnail) => {
  return axios.patch('/wp-json/utubevideogallery/v1/albums/' + albumID, {
    title: albumData.title,
    thumbnail: cleanedThumbnail,
    videoSorting: albumData.videoSorting,
    galleryID: albumData.galleryID
  }, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });
}

export default {
  fetchAlbum,
  fetchGalleries,
  parseGalleriesData,
  fetchThumbnails,
  parseThumbnailsData,
  getCleanThumbnail,
  updateAlbum
}
