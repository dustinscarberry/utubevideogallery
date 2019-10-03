<?php

namespace UTubeVideoGallery\Form;

use UTubeVideoGallery\Exception\UserMessageException;

class VideoOrderType
{
  private $videoIDs = [];

  public function __construct($req)
  {
    if (isset($req['videoids']))
    {
      foreach ($req['videoids'] as $videoID)
        $this->videoIDs[] = sanitize_key($videoID);
    }
  }

  public function getVideoIDs()
  {
    return $this->videoIDs;
  }

  public function validate()
  {
    if (count($this->videoIDs) == 0)
      throw new UserMessageException(__('Invalid data', 'utvg'));

    foreach ($this->videoIDs as $videoID)
    {
      if (!$videoID)
        throw new UserMessageException(__('Invalid videoID value', 'utvg'));
    }
  }
}
