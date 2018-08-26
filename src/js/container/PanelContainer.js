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
      currentPage: 1,
      perPage: 12
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
      this.setState({selectedVideo: this.state.selectedVideo - 1});
  }

  nextVideo()
  {
    if (this.state.selectedVideo < this.state.videos.length - 1)
      this.setState({selectedVideo: this.state.selectedVideo + 1});
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
    let videos = [];
    let results = await axios.get('http://localhost/wp-json/utubevideogallery/v1/galleries/' + this.props.id);

    if (results.status == 200)
    {
      for (let album of results.data.albums)
      {
        for (let video of album.videos)
          videos.push(video);
      }

      let perPage = this.props.perPage || 12;
      let totalPages = Math.ceil(videos.length / perPage);

      this.setState({
        videos: videos,
        thumbnailType: results.data.thumbtype,
        selectedVideo: 5,
        totalPages: totalPages,
        perPage: perPage
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
        perPage={this.state.perPage}
      />
    );
  }
}

export default PanelContainer;
