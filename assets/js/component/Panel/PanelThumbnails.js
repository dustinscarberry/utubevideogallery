import classnames from 'classnames';
import ThumbnailsGrid from 'component/shared/ThumbnailsGrid';
import Thumbnail from './Thumbnail';

const PanelThumbnails = ({
  videos,
  selectedVideo,
  currentPage,
  videosPerPage,
  onChangeVideo,
  thumbnailType
}) => {
  const startIndex = (currentPage - 1) * parseInt(videosPerPage);
  const endIndex = startIndex + parseInt(videosPerPage);

  const thumbnailsClasses = ['utv-panel-thumbnails', 'utv-align-center'];
  if (thumbnailType == 'square')
    thumbnailsClasses.push('utv-thumbnails-square');
  else
    thumbnailsClasses.push('utv-thumbnails-rectangle');

  const thumbnailNodes = videos.map((video, i) => {
    if (i >= startIndex && i < endIndex)
      return (<Thumbnail
        key={i}
        title={video.title}
        image={video.thumbnail.replace('.jpg', '@2x.jpg')}
        value={i}
        selected={i == selectedVideo ? true : false}
        onChangeVideo={onChangeVideo}
      />);
  });

  return <ThumbnailsGrid classes={classnames(thumbnailsClasses)}>
    {thumbnailNodes}
  </ThumbnailsGrid>
}

export default PanelThumbnails;
