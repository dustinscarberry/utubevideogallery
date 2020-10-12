<?php

namespace CodeClouds\UTubeVideoGallery\Form;

use CodeClouds\UTubeVideoGallery\Exception\UserMessageException;

class VideoOrderType
{
  private $videoIDs = [];

  function __construct($req)
  {
    if (isset($req['videoids']))
    {
      foreach ($req['videoids'] as $videoID)
        $this->videoIDs[] = sanitize_key($videoID);
    }
  }

  function getVideoIDs()
  {
    return $this->videoIDs;
  }

  // validate form
  function validate()
  {
    if (count($this->videoIDs) == 0)
      throw new UserMessageException(__('Invalid data', 'utvg'));

    foreach ($this->videoIDs as $videoID) {
      if (!$videoID)
        throw new UserMessageException(__('Invalid videoID value', 'utvg'));
    }
  }
}
