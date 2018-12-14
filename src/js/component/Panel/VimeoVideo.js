import React from 'react';
import Iframe from '../shared/Iframe';
import sharedService from '../../service/SharedService';

const VimeoVideo = (props) =>
{
  const {
    videoData,
    forceNoAutoplay
  } = props;

  const source = sharedService.getVimeoEmbedURL(
    videoData.slugID,
    (forceNoAutoplay ? '0' : utvJSData.vimeoAutoplay),
    utvJSData.vimeoDetailsHide,
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
