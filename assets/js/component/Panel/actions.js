import axios from 'axios';

export const fetchPanelData = async (galleryId, videosPerPage, maxVideos = undefined) => {
  const apiData = await axios.get('/wp-json/utubevideogallery/v1/galleriesdata/' + galleryId);

  if (!(apiData.status == 200 && !apiData.data.error))
    return false;

  const data = apiData.data.data;
  let videos = [];

  for (const album of data.albums) {
    for (const video of album.videos)
      videos.push(video);
  }

  if (maxVideos)
    videos = videos.slice(0, maxVideos);

  const totalPages = Math.ceil(videos.length / videosPerPage);

  return {
    videos: videos,
    thumbnailType: data.thumbnailType,
    totalPages: totalPages
  };
}
