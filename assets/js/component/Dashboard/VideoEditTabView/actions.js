import axios from 'axios';

export function fetchVideo(videoID)
{
  return axios.get(
    '/wp-json/utubevideogallery/v1/videos/' + videoID,
    {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    }
  );
}

export function updateVideo(videoID, state)
{
  return axios.patch(
    '/wp-json/utubevideogallery/v1/videos/' + videoID,
    {
      title: state.title,
      description: state.description,
      quality: state.quality,
      showControls: state.showControls,
      startTime: state.startTime,
      endTime: state.endTime,
      albumID: state.album
    },
    {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    }
  );
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
