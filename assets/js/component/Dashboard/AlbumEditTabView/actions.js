import axios from 'axios';

//fetch album
export function fetchAlbum(albumID)
{
  return axios.get('/wp-json/utubevideogallery/v1/albums/' + albumID,
    {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    }
  );
}

//fetch galleries
export function fetchGalleries()
{
  return axios.get('/wp-json/utubevideogallery/v1/galleries/',
    {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    }
  );
}

//parse list of galleries from fetchGalleries() for galleries selectbox
export function parseGalleriesData(data)
{
  let galleries = [];

  for (let gallery of data)
    galleries.push({name: gallery.title, value: gallery.id});

  return galleries;
}

//fetch videos in album for thumbnails
export function fetchThumbnails(albumID)
{
  return axios.get(
    '/wp-json/utubevideogallery/v1/albums/'
    + albumID
    + '/videos'
  );
}

//parse list of videos from fetchThumbnails() for thumbnails selection
export function parseThumbnailsData(data)
{
  let thumbnails = [];

  for (let video of data)
    thumbnails.push({thumbnail: video.thumbnail});

  return thumbnails;
}

//get clean [just slug] for thumbnail
export function getCleanThumbnail(thumbnail)
{
  thumbnail = thumbnail.replace(utvJSData.thumbnailCacheDirectory, '');
  return thumbnail.replace('.jpg', '');
}

//update album
export function updateAlbum(albumID, title, thumbnail, videoSorting, galleryID)
{
  return axios.patch('/wp-json/utubevideogallery/v1/albums/' + albumID,
    {
      title: title,
      thumbnail: thumbnail,
      videoSorting: videoSorting,
      galleryID: galleryID
    },
    {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    }
  );
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
