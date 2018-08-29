import React from 'react';
import axios from 'axios';
import Panel from '../component/panel/Panel';

class PanelContainer extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      videos: [],
      thumbnailType: undefined,
      selectedVideo: undefined,
      totalPages: undefined,
      currentPage: 1
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
    this.setState({selectedVideo: videoIndex});
  }

  changePage(page)
  {
    this.setState({currentPage: page});
  }

  async loadAPIData()
  {
    console.log(this.props);
    let videos = [];
    let results = await axios.get('http://localhost/wp-json/utubevideogallery/v1/galleries/' + this.props.id);

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
        selectedVideo: 5,
        totalPages: totalPages
      });
    }
  }

  render()
  {
    if (this.state.selectedVideo === undefined)
      return null;

    return (
      <Panel
        videos={this.state.videos}
        selectedVideo={this.state.selectedVideo}
        thumbnailType={this.state.thumbnailType}
        onPreviousVideo={this.previousVideo}
        onNextVideo={this.nextVideo}
        onChangeVideo={this.changeVideo}
        currentPage={this.state.currentPage}
        totalPages={this.state.totalPages}
        onChangePage={this.changePage}
        videosPerPage={this.props.videosPerPage}
        controls={this.props.controls}
      />
    );
  }
}

PanelContainer.defaultProps = {
  videosPerPage: 12,
  controls: false
};

export default PanelContainer;
