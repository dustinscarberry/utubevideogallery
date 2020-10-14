import React from 'react';
import axios from 'axios';
import AlbumView from './AlbumView';
import VideoView from './VideoView';
import sharedService from '../../service/SharedService';

class Gallery extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      albums: [],//object of albums and there videos
      videos: [],//object of just videos
      thumbnailType: undefined,
      displayType: undefined,
      currentPage: 1
    };

    this.loadAPIData();
  }

  loadAPIData = async () =>
  {
    const {
      id,
      maxAlbums,
      maxVideos
    } = this.props;

    const apiData = await axios.get(
      '/wp-json/utubevideogallery/v1/galleriesdata/'
      + id
    );

    if (apiData.status == 200 && !apiData.data.error) {
      const data = apiData.data.data;
      let albums = [];
      let videos = [];

      if (data.displaytype == 'video') {
        for (const album of data.albums) {
          for (const video of album.videos)
            videos.push(video);
        }

        if (maxVideos)
          videos = videos.slice(0, maxVideos);
      }
      else if (data.displaytype == 'album')
      {
        albums = data.albums;

        // filter on maxalbums and maxvideos if specified
        if (maxAlbums)
          albums = albums.slice(0, maxAlbums);

        if (maxVideos) {
          data.albums = data.albums.map(album => {
            album.videos = album.videos.slice(0, maxVideos);
            return album;
          });
        }
      }

      this.setState({
        albums: albums || [],
        videos: videos,
        thumbnailType: data.thumbnailType || undefined,
        displayType: (data.displaytype == 'album' ? 'albums' : 'videos')
      });
    }
  }

  getYouTubeURL(video)
  {
    return sharedService.getYouTubeEmbedURL(
      video.slugID,
      utvJSData.setting.youtubeDetailsHide,
      video.chrome,
      utvJSData.setting.playerControlTheme,
      utvJSData.setting.playerProgressColor,
      utvJSData.setting.youtubeAutoplay,
      video.startTime,
      video.endTime
    );
  }

  getVimeoURL(video)
  {
    return sharedService.getVimeoEmbedURL(
      video.slugID,
      utvJSData.setting.vimeoAutoplay,
      utvJSData.setting.vimeoDetailsHide,
      video.startTime
    );
  }

  openVideoPopup = (video) =>
  {
    let url;

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
          '</div><div class="utv-mfp-bottom-bar mfp-prevent-close">' +
          '<div class="mfp-title mfp-prevent-close"></div>' +
          '<div class="mfp-description mfp-prevent-close"></div></div>'
      },
      key: 'utvid',
      callbacks: {
        open: () =>
        {
          const popup = document.querySelector('.mfp-container');
          popup.querySelector('.mfp-content').style.maxWidth = utvJSData.setting.playerWidth + 'px';
          popup.querySelector('.mfp-title').innerText = video.title;
          const overlay = document.querySelector('.mfp-bg');
          overlay.style.background = utvJSData.setting.lightboxOverlayColor;
          overlay.style.opacity = utvJSData.setting.lightboxOverlayOpacity;

          if (video.description && utvJSData.setting.showVideoDescription)
          {
            popup.querySelector('.mfp-description').innerText = video.description;
            popup.classList.add('mfp-has-meta');
          }
          else
            popup.querySelector('.mfp-description').innerText = '';
        }
      }
    });
  }

  changePage = (page) =>
  {
    this.setState({currentPage: page});
  }

  render()
  {
    const {
      albums,
      videos,
      thumbnailType,
      displayType,
      currentPage
    } = this.state;

    if (displayType == 'albums' && albums.length)
      return <AlbumView
        albums={albums}
        onOpenVideoPopup={this.openVideoPopup}
        thumbnailType={thumbnailType}
        iconType={this.props.iconType}
        thumbnailsPerPage={this.props.thumbnailsPerPage}
        currentPage={currentPage}
        onChangePage={this.changePage}
      />;
    else if (displayType == 'videos' && videos.length)
      return <VideoView
        videos={videos}
        onOpenVideoPopup={this.openVideoPopup}
        thumbnailType={thumbnailType}
        iconType={this.props.iconType}
        thumbnailsPerPage={this.props.thumbnailsPerPage}
        currentPage={currentPage}
        onChangePage={this.changePage}
      />;
    else
      return null;
  }
}

Gallery.defaultProps = {
  iconType: 'red',
  maxAlbums: undefined,
  maxVideos: undefined,
  thumbnailsPerPage: undefined
};

export default Gallery;
