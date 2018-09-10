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
    this.openVideoPopup = this.openVideoPopup.bind(this);
  }

  componentWillMount()
  {
    this.loadAPIData();
  }

  async loadAPIData()
  {
    let results = await axios.get('/wp-json/utubevideogallery/v1/galleriesdata/' + this.props.id);

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

  getYouTubeURL(video)
  {
    let source = 'https://www.youtube.com/embed/';
    source += video.slugID;
    source += '?modestbranding=1';
    source += '&rel=0';
    source += '&showinfo=' + (utvJSData.youtubeDetailsHide == '1' ? '0' : '1');
    source += '&autohide=1';
    source += '&controls=' + (video.chrome == true ? '1' : '0');
    source += '&theme=' + utvJSData.playerControlTheme;
    source += '&color=' + utvJSData.playerProgressColor;
    source += '&autoplay=' + utvJSData.youtubeAutoplay;
    source += '&iv_load_policy=3';
    source += '&start=' + video.startTime;
    source += '&end=' + video.endTime;
    return source;
  }

  getVimeoURL(video)
  {
    let source = 'https://player.vimeo.com/video/';
    source += video.slugID;
    source += '?autoplay=' + utvJSData.vimeoAutoplay;
    source += '&autopause=0';
    source += (utvJSData.vimeoDetailsHide == '1' ? 'title=0&portrait=0&byline=0&badge=0' : 'title=1&portrait=1&byline=1&badge=1');
    source += '#t=' + video.startTime;
    return source;
  }

  openVideoPopup(video)
  {
    let url = undefined;

    if (video.source == 'youtube')
      url = this.getYouTubeURL(video);
    else if (video.source == 'vimeo')
      url = this.getVimeoURL(video);

    let title = video.title || '';

    jQuery.magnificPopup.open(
    {
      items: {
        src: url
      },
      type: 'iframe',
      iframe: {
        patterns: [],
        markup: '<div class="utv-mfp-iframe-scaler mfp-iframe-scaler">' +
          '<div class="mfp-close"></div>' +
          '<iframe class="mfp-iframe" frameborder="0" width="' + utvJSData.playerWidth + '" height="' + utvJSData.playerHeight + '" allowfullscreen></iframe>' +
          '</div><div class="utv-mfp-bottom-bar">'+
          '<div class="mfp-title"></div></div>'
      },
      key: 'utvid',
      callbacks: {
        open: function() {
          let popup = document.querySelector('.mfp-container');
          popup.querySelector('.mfp-content').style.maxWidth = utvJSData.playerWidth + 'px';
          popup.querySelector('.mfp-title').innerText = title;
          let bg = popup.querySelector('.mfp-bg');
          bg.style.background = utvJSData.lightboxOverlayColor;
          bg.style.opacity = utvJSData.lightboxOverlayOpacity;
        }
      }
    });
  }

  render()
  {
    if (this.state.albums.length == 0)
      return null;

    if (this.state.displayType == 'albums')
      return <AlbumView
        albums={this.state.albums}
        onOpenVideoPopup={this.openVideoPopup}
      />;
    else if (this.state.displayType == 'videos')
      return <VideoView
        videos={this.state.videos}
        onOpenVideoPopup={this.openVideoPopup}
      />;
    else
      return null;
  }
}

Gallery.defaultProps = {};

export default Gallery;
