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
    utvJSData.setting.youtubeDetailsHide,
    controls,
    utvJSData.setting.playerControlTheme,
    utvJSData.setting.playerProgressColor,
    (forceNoAutoplay ? '0' : utvJSData.setting.youtubeAutoplay),
    videoData.startTime,
    videoData.endTime
  );

  return (
    <Iframe
      classes={['utv-panel-iframe']}
      src={source}
    />
  );
}

export default YouTubeVideo;
