import React from 'react';
import Iframe from '../shared/Iframe';
import sharedService from '../../service/SharedService';

const YouTubeVideo = (props) =>
{
  const {
    videoData,
    controls,
    forceNoAutoplay
  } = props;

  const source = sharedService.getYouTubeEmbedURL(
    videoData.slugID,
    utvJSData.youtubeDetailsHide,
    controls,
    utvJSData.playerControlTheme,
    utvJSData.playerProgressColor,
    (forceNoAutoplay ? '0' : utvJSData.youtubeAutoplay),
    videoData.startTime,
    videoData.endTime
  );

  return (
    <Iframe
      classes={['utv-video-panel-iframe']}
      src={source}
    />
  );
}

export default YouTubeVideo;
