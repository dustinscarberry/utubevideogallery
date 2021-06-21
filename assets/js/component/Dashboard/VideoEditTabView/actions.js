import axios from 'axios';
import apiHelper from 'helpers/api-helpers';

export const fetchVideo = async (videoID) => {
  const rsp = await axios.get('/wp-json/utubevideogallery/v1/videos/' + videoID, {
    headers: {'X-WP-Nonce': utvJSData.restNonce}
  });


}

export const updateVideo = async (videoID, videoData) => {
  const rsp = await axios.patch('/wp-json/utubevideogallery/v1/videos/' + videoID,
    videoData,
    {headers: {'X-WP-Nonce': utvJSData.restNonce}}
  );

  if (apiHelper.isValidResponse(rsp)) return true;
  if (apiHelper.isErrorResponse(rsp)) return apiHelper.getErrorMessage(rsp);
  return false;
}

export function getVideoPreview(source, sourceID, startTime, endTime)
{
  let src = '';

  if (source == 'youtube')
  {
    src = 'https://www.youtube.com/embed/';
    src += sourceID;
    src += '?modestbranding=1';
    src += '&rel=0';
    src += '&showinfo=0';
    src += '&autohide=0';
    src += '&iv_load_policy=3';
    src += '&color=white';
    src += '&theme=dark';
    src += '&autoplay=0';
    src += '&start=' + startTime;
    src += '&end=' + endTime;
  }
  else if (source == 'vimeo')
  {
    src = 'https://player.vimeo.com/video/';
    src += sourceID;
    src += '?title=0';
    src += '&portrait=0';
    src += '&byline=0';
    src += '&badge=0';
    src += '&autoplay=0';
    src += '#t=' + startTime;
  }

  return src;
}

export function fetchGalleryAlbums(galleryID)
{
  return axios.get(
    '/wp-json/utubevideogallery/v1/galleries/' + galleryID + '/albums',
    {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    }
  );
}

export function parseAlbumsData(data)
{
  const albums = [];

  for (const album of data)
    albums.push({
      name: album.title,
      value: album.id
    });

  return albums;
}

export function getFormattedSource(source)
{
  if (source == 'youtube')
    return 'YouTube';
  else if (source == 'vimeo')
    return 'Vimeo';
  else
    return undefined;
}

export default {
  fetchVideo,
  updateVideo,
  getVideoPreview,
  fetchGalleryAlbums,
  parseAlbumsData,
  getFormattedSource
}
