import React from 'react';
import axios from 'axios';
import VideoPlayer from './VideoPlayer';
import TitleControls from './TitleControls';
import Description from './Description';
import PanelThumbnails from './PanelThumbnails';
import Paging from './Paging';

class Panel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      videos: [],
      thumbnailType: undefined,
      selectedVideo: 0,
      totalPages: undefined,
      currentPage: 1,
      forceNoAutoplay: true
    }

    this.loadAPIData = this.loadAPIData.bind(this);
    this.previousVideo = this.previousVideo.bind(this);
    this.nextVideo = this.nextVideo.bind(this);
    this.changeVideo = this.changeVideo.bind(this);
    this.changePage = this.changePage.bind(this);

    this.loadAPIData();
  }

  turnOnAutoplay()
  {
    this.setState({forceNoAutoplay: false});
  }

  previousVideo()
  {
    if (this.state.selectedVideo > 0)
    {
      this.changeVideo(this.state.selectedVideo - 1);
      this.changePage(Math.ceil(this.state.selectedVideo / this.props.videosPerPage));
    }
  }

  nextVideo()
  {
    if (this.state.selectedVideo < this.state.videos.length - 1)
    {
      this.changeVideo(this.state.selectedVideo + 1);
      this.changePage(Math.ceil((this.state.selectedVideo + 2) / this.props.videosPerPage));
    }
  }

  changeVideo(videoIndex)
  {
    if (this.state.forceNoAutoplay)
      this.turnOnAutoplay();

    this.setState({selectedVideo: videoIndex});
  }

  changePage(page)
  {
    this.setState({currentPage: page});
  }

  getPanelClasses()
  {
    const {
      theme,
      icon
    } = this.props;

    const panelClasses = ['utv-panel'];

    if (theme == 'light')
      panelClasses.push('utv-panel-light');
    else if (theme == 'dark')
      panelClasses.push('utv-panel-dark');
    else
      panelClasses.push('utv-panel-transparent');

    if (icon == 'red')
      panelClasses.push('utv-icon-red');
    else if (icon == 'blue')
      panelClasses.push('utv-icon-blue');
    else
      panelClasses.push('utv-icon-default');

    return panelClasses.join(' ');
  }

  async loadAPIData()
  {
    const {
      id,
      videosPerPage,
      maxVideos
    } = this.props;

    const apiData = await axios.get(
      '/wp-json/utubevideogallery/v1/galleriesdata/'
      + id
    );

    if (apiData.status == 200 && !apiData.data.error)
    {
      const data = apiData.data.data;
      let videos = [];

      for (const album of data.albums)
      {
        for (const video of album.videos)
          videos.push(video);
      }

      if (maxVideos)
        videos = videos.slice(0, maxVideos);

      const totalPages = Math.ceil(videos.length / videosPerPage);

      this.setState({
        videos: videos,
        thumbnailType: data.thumbnailType,
        totalPages: totalPages
      });
    }
  }

  render()
  {
    const {
      videos,
      forceNoAutoplay,
      selectedVideo,
      currentPage,
      totalPages,
      thumbnailType
    } = this.state;

    if (videos.length == 0)
      return null;

    return (
      <div className={this.getPanelClasses()}>
        <VideoPlayer
          videoData={videos[selectedVideo]}
          controls={this.props.controls}
          forceNoAutoplay={forceNoAutoplay}
        />
        <TitleControls
          videoData={videos[selectedVideo]}
          onPreviousVideo={this.previousVideo}
          onNextVideo={this.nextVideo}
        />
        <Description
          text={videos[selectedVideo].description}
        />
        <PanelThumbnails
          videos={videos}
          selectedVideo={selectedVideo}
          onChangeVideo={this.changeVideo}
          currentPage={currentPage}
          videosPerPage={this.props.videosPerPage}
          thumbnailType={thumbnailType}
        />
        <Paging
          currentPage={currentPage}
          totalPages={totalPages}
          onChangePage={this.changePage}
        />
      </div>
    );
  }
}

Panel.defaultProps = {
  videosPerPage: 14,
  controls: false,
  theme: 'light',
  icon: 'red',
  maxVideos: undefined
};

export default Panel;
