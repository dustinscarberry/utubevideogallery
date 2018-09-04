import React from 'react';
import axios from 'axios';
import AlbumView from './AlbumView';
import VideoView from './VideoView';

class Gallery extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      albums: [],//object of albums and there videos
      videos: [],//object of just videos
      thumbnailType: undefined,
      displayType: undefined
    };

    this.loadAPIData = this.loadAPIData.bind(this);
  }

  componentWillMount()
  {
    this.loadAPIData();
  }

  async loadAPIData()
  {
    let results = await axios.get('http://localhost/wp-json/utubevideogallery/v1/galleries/' + this.props.id);

    if (results.status == 200)
    {
      let videos = [];

      for (let album of results.data.albums)
      {
        for (let video of album.videos)
          videos.push(video);
      }

      this.setState({
        albums: results.data.albums || [],
        videos: videos,
        thumbnailType: results.data.thumbtype || undefined,
        displayType: (results.data.displaytype == 'album' ? 'albums' : 'videos') || undefined
      });
    }
  }

  render()
  {
    if (this.state.albums.length == 0)
      return null;

    if (this.state.displayType == 'albums')
      return <AlbumView
        albums={this.state.albums}
      />;
    else if (this.state.displayType == 'videos')
      return <VideoView
        videos={this.state.videos}
      />;
    else
      return null;
  }
}

Gallery.defaultProps = {};

export default Gallery;
