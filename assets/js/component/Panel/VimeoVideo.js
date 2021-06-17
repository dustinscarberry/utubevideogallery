import React from 'react';
import Iframe from 'component/shared/Iframe';
import { getVimeoEmbedURL } from 'helpers/vimeo-helpers';

const VimeoVideo = ({videoData, forceNoAutoplay}) => {
  const source = getVimeoEmbedURL(
    videoData.slugID,
    (forceNoAutoplay ? '0' : utvJSData.setting.vimeoAutoplay),
    utvJSData.setting.vimeoDetailsHide,
    videoData.startTime
  );

  return <Iframe
    classes={['utv-panel-iframe']}
    src={source}
  />
}

export default VimeoVideo;
