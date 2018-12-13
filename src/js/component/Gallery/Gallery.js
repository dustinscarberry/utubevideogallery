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
    const apiData = await axios.get(
      '/wp-json/utubevideogallery/v1/galleriesdata/'
      + this.props.id
    );

    if (apiData.status == 200 && !apiData.data.error)
    {
      const videos = [];

      for (const album of apiData.data.albums)
      {
        for (const video of album.videos)
          videos.push(video);
      }

      this.setState({
        albums: apiData.data.albums || [],
        videos: videos,
        thumbnailType: apiData.data.thumbnailType || undefined,
        displayType: (apiData.data.displaytype == 'album' ? 'albums' : 'videos')
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
          '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
          '</div><div class="utv-mfp-bottom-bar">'+
          '<div class="mfp-title"></div></div>'
      },
      key: 'utvid',
      callbacks: {
        open: function() {
          const popup = document.querySelector('.mfp-container');
          popup.querySelector('.mfp-content').style.maxWidth = utvJSData.playerWidth + 'px';
          popup.querySelector('.mfp-title').innerText = video.title;
          const overlay = document.querySelector('.mfp-bg');
          overlay.style.background = utvJSData.lightboxOverlayColor;
          overlay.style.opacity = utvJSData.lightboxOverlayOpacity;
        }
      }
    });
  }

  render()
  {
    const {
      albums,
      videos,
      thumbnailType,
      displayType
    } = this.state;

    if (albums.length == 0)
      return null;

    if (displayType == 'albums')
      return <AlbumView
        albums={albums}
        onOpenVideoPopup={this.openVideoPopup}
        thumbnailType={thumbnailType}
        iconType={this.props.iconType}
      />;
    else if (displayType == 'videos')
      return <VideoView
        videos={videos}
        onOpenVideoPopup={this.openVideoPopup}
        thumbnailType={thumbnailType}
        iconType={this.props.iconType}
      />;
    else
      return null;
  }
}

Gallery.defaultProps = {
  iconType: 'red'
};

export default Gallery;
