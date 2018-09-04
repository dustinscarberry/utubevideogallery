import React from 'react';
import VideoThumbnails from './VideoThumbnails';

class VideoView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.openVideo = this.openVideo.bind(this);
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

  openVideoPopup(url, title)
  {
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

  openVideo(value)
  {
    let selectedVideo = this.props.videos[value];

    if (selectedVideo)
    {
      let url = undefined;

      if (selectedVideo.source == 'youtube')
        url = this.getYouTubeURL(selectedVideo);
      else if (selectedVideo.source == 'vimeo')
        url = this.getVimeoURL(selectedVideo);

      let title = selectedVideo.title || '';

      this.openVideoPopup(url, title);
    }
  }

  render()
  {
    return (
      <div className="utv-container utv-albums utv-icon-red">
        <VideoThumbnails
          videos={this.props.videos}
          onOpenVideo={this.openVideo}
        />
      </div>
    );
  }
}

export default VideoView;
