import axios from 'axios';

export async function fetchGalleries()
{
  return await axios.get('/wp-json/utubevideogallery/v1/galleries/');
}

export function parseGalleriesData(data)
{
  let galleries = [];

  for (let gallery of data)
    galleries.push({name: gallery.title, value: gallery.id});

  return galleries;
}

export async function fetchThumbnails(albumID)
{
  return await axios.get(
    '/wp-json/utubevideogallery/v1/albums/'
    + albumID
    + '/videos'
  );
}

export function parseThumbnailsData(data)
{
  let thumbnails = [];

  for (let video of data)
    thumbnails.push({thumbnail: video.thumbnail});

  return thumbnails;
}
