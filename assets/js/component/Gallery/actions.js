import axios from 'axios';

// fetch and transform gallery data
export async function fetchGalleryData(galleryId, maxAlbums = undefined, maxVideos = undefined)
{
  const apiData = await axios.get('/wp-json/utubevideogallery/v1/galleriesdata/' + galleryId);

  if (!(apiData.status == 200 && !apiData.data.error))
    return false;

  const data = apiData.data.data;
  let albums = [];
  let videos = [];

  // videos only view data
  if (data.displaytype == 'video') {
    for (const album of data.albums) {
      for (const video of album.videos)
        videos.push(video);
    }

    if (maxVideos)
      videos = videos.slice(0, maxVideos);
  }
  // albums and videos view data
  else if (data.displaytype == 'album') {
    albums = data.albums || [];

    // filter on maxalbums and maxvideos if specified
    if (maxAlbums)
      albums = albums.slice(0, maxAlbums);

    if (maxVideos) {
      data.albums = data.albums.map(album => {
        album.videos = album.videos.slice(0, maxVideos);
        return album;
      });
    }
  }

  return {
    albums: albums,
    videos: videos,
    thumbnailType: data.thumbnailType || undefined,
    displayType: (data.displaytype == 'album' ? 'albums' : 'videos')
  };
}
