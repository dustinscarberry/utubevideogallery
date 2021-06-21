import React from 'react';
import AlbumView from './AlbumView';
import VideoView from './VideoView';
import Loader from 'component/shared/Loader';
import { fetchGalleryData } from './actions';
import { getYouTubeEmbedURL } from 'helpers/youtube-helpers';
import { getVimeoEmbedURL } from 'helpers/vimeo-helpers';

class Gallery extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      albums: [], // object of albums and videos
      videos: [], // object of just videos
      thumbnailType: undefined,
      displayType: undefined,
      currentPage: 1
    };
  }

  componentDidMount() {
    this.loadAPIData();
  }

  loadAPIData = async () => {
    const { id, maxAlbums, maxVideos } = this.props;
    const galleryData = await fetchGalleryData(id, maxAlbums, maxVideos);

    if (galleryData) {
      this.setState(galleryData);
      this.setState({isLoading: false});
    }
  }

  getVideoEmbedURL = (video) => {
    if (video.source == 'youtube')
      return getYouTubeEmbedURL(
        video.slugID,
        utvJSData.setting.youtubeDetailsHide,
        video.chrome,
        utvJSData.setting.playerControlTheme,
        utvJSData.setting.playerProgressColor,
        utvJSData.setting.youtubeAutoplay,
        video.startTime,
        video.endTime
      );
    else if (video.source == 'vimeo')
      return getVimeoEmbedURL(
        video.slugID,
        utvJSData.setting.vimeoAutoplay,
        utvJSData.setting.vimeoDetailsHide,
        video.startTime
      );
  }

  openVideoPopup = (video) => {
    const embedURL = this.getVideoEmbedURL(video);

    jQuery.magnificPopup.open({
      items: {
        src: embedURL
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
        open: () => {
          const popup = document.querySelector('.mfp-container');
          popup.querySelector('.mfp-content').style.maxWidth = utvJSData.setting.playerWidth + 'px';
          popup.querySelector('.mfp-title').innerText = video.title;
          const overlay = document.querySelector('.mfp-bg');
          overlay.style.background = utvJSData.setting.lightboxOverlayColor;
          overlay.style.opacity = utvJSData.setting.lightboxOverlayOpacity;

          if (video.description && utvJSData.setting.showVideoDescription) {
            popup.querySelector('.mfp-description').innerText = video.description;
            popup.classList.add('mfp-has-meta');
          } else
            popup.querySelector('.mfp-description').innerText = '';
        }
      }
    });
  }

  changePage = (page) => {
    this.setState({currentPage: page});
  }

  render() {
    const {
      isLoading,
      albums,
      videos,
      thumbnailType,
      displayType,
      currentPage
    } = this.state;

    if (isLoading)
      return <Loader/>;

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
