import React from 'react';
import axios from 'axios';
import VideoPlayer from './VideoPlayer';
import Controls from './Controls';
import Thumbnails from './Thumbnails';
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
  }

  componentWillMount()
  {
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
    let panelClasses = ['utv-panel'];

    if (this.props.theme == 'light')
      panelClasses.push('utv-panel-light');
    else if (this.props.theme == 'dark')
      panelClasses.push('utv-panel-dark');
    else if (this.props.theme == 'transparent')
      panelClasses.push('utv-panel-transparent');1

    if (this.props.icon == 'red')
      panelClasses.push('utv-icon-red');
    else if (this.props.icon == 'blue')
      panelClasses.push('utv-icon-blue');
    else if (this.props.icon == 'default')
      panelClasses.push('utv-icon-default');

    return panelClasses.join(' ');
  }

  async loadAPIData()
  {
    let videos = [];
    let results = await axios.get('/wp-json/utubevideogallery/v1/galleries/' + this.props.id);

    if (results.status == 200)
    {
      for (let album of results.data.albums)
      {
        for (let video of album.videos)
          videos.push(video);
      }

      let totalPages = Math.ceil(videos.length / this.props.videosPerPage);

      this.setState({
        videos: videos,
        thumbnailType: results.data.thumbtype,
        totalPages: totalPages
      });
    }
  }

  render()
  {
    if (this.state.videos.length == 0)
      return null;

    return (
      <div className={this.getPanelClasses()}>
        <VideoPlayer
          videoData={this.state.videos[this.state.selectedVideo]}
          controls={this.props.controls}
          forceNoAutoplay={this.state.forceNoAutoplay}
        />
        <Controls
          videoData={this.state.videos[this.state.selectedVideo]}
          onPreviousVideo={this.previousVideo}
          onNextVideo={this.nextVideo}
        />
        <Thumbnails
          videos={this.state.videos}
          selectedVideo={this.state.selectedVideo}
          onChangeVideo={this.changeVideo}
          currentPage={this.state.currentPage}
          videosPerPage={this.props.videosPerPage}
        />
        <Paging
          currentPage={this.state.currentPage}
          totalPages={this.state.totalPages}
          onChangePage={this.changePage}
        />
      </div>
    );
  }
}

Panel.defaultProps = {
  videosPerPage: 12,
  controls: false,
  theme: 'light',
  icon: 'red'
};

export default Panel;
