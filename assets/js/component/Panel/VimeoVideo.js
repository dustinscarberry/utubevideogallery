import React from 'react';
import Iframe from '../shared/Iframe';
import sharedService from '../../service/SharedService';

const VimeoVideo = ({videoData, forceNoAutoplay}) =>
{
  const source = sharedService.getVimeoEmbedURL(
    videoData.slugID,
    (forceNoAutoplay ? '0' : utvJSData.setting.vimeoAutoplay),
    utvJSData.setting.vimeoDetailsHide,
    videoData.startTime
  );

  return (
    <Iframe
      classes={['utv-panel-iframe']}
      src={source}
    />
  );
}

export default VimeoVideo;
