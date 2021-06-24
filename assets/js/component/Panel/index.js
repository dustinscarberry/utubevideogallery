import React from 'react';
import classnames from 'classnames';
import { fetchPanelData } from './logic';

import VideoPlayer from './VideoPlayer';
import TitleControls from './TitleControls';
import Description from './Description';
import PanelThumbnails from './PanelThumbnails';
import Paging from './Paging';
import Loader from 'component/shared/Loader';

class Panel extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      videos: [],
      thumbnailType: undefined,
      selectedVideo: 0,
      totalPages: undefined,
      currentPage: 1,
      forceNoAutoplay: true
    }

    // create ref for player auto scroll
    this.panel = React.createRef();
  }

  componentDidMount() {
    this.loadAPIData();
  }

  loadAPIData = async() => {
    const {
      id,
      videosPerPage,
      maxVideos
    } = this.props;

    const panelData = await fetchPanelData(id, videosPerPage, maxVideos);

    if (panelData) {
      this.setState(panelData);
      this.setState({isLoading: false});
    }
  }

  turnOnAutoplay = () => {
    this.setState({forceNoAutoplay: false});
  }

  previousVideo = () => {
    const { selectedVideo } = this.state;
    const { videosPerPage } = this.props;

    if (selectedVideo > 0) {
      this.changeVideo(selectedVideo - 1);
      this.changePage(Math.ceil(selectedVideo / videosPerPage));
    }
  }

  nextVideo = () => {
    const { selectedVideo, videos } = this.state;
    const { videosPerPage } = this.props;

    if (selectedVideo < videos.length - 1) {
      this.changeVideo(selectedVideo + 1);
      this.changePage(Math.ceil((selectedVideo + 2) / videosPerPage));
    }
  }

  changeVideo = (videoIndex) => {
    if (this.state.forceNoAutoplay)
      this.turnOnAutoplay();

    this.setState({selectedVideo: videoIndex});
    this.scrollToPanel();
  }

  changePage = (page) => {
    this.setState({currentPage: page});
  }

  scrollToPanel = () => {
    window.scrollTo(0, this.panel.current.offsetTop - 30);
  }

  getPanelClasses = () => {
    const {theme, icon} = this.props;

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

    return panelClasses;
  }

  render() {
    const {
      isLoading,
      videos,
      forceNoAutoplay,
      selectedVideo,
      currentPage,
      totalPages,
      thumbnailType
    } = this.state;

    if (isLoading)
      return <Loader/>;

    if (videos.length == 0)
      return null;

    return <div ref={this.panel} className={classnames(this.getPanelClasses())}>
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
