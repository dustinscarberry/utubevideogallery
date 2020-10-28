import React from 'react';
import Iframe from 'component/shared/Iframe';
import { getYouTubeEmbedURL } from 'helpers/youtube-helpers';

const YouTubeVideo = ({videoData, controls, forceNoAutoplay}) => {
  const source = getYouTubeEmbedURL(
    videoData.slugID,
    utvJSData.setting.youtubeDetailsHide,
    controls,
    utvJSData.setting.playerControlTheme,
    utvJSData.setting.playerProgressColor,
    (forceNoAutoplay ? '0' : utvJSData.setting.youtubeAutoplay),
    videoData.startTime,
    videoData.endTime
  );

  return <Iframe
    classes={['utv-panel-iframe']}
    src={source}
  />;
}

export default YouTubeVideo;
