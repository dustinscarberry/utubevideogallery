<?php

namespace UTubeVideoGallery\Form;

use UTubeVideoGallery\Exception\UserMessageException;

class AlbumOrderType
{
  private $albumIDs = [];

  public function __construct($req)
  {
    if (isset($req['albumids']))
    {
      foreach ($req['albumids'] as $albumID)
        $this->albumIDs[] = sanitize_key($albumID);
    }
  }

  public function getAlbumIDs()
  {
    return $this->albumIDs;
  }

  public function validate()
  {
    if (count($this->albumIDs) == 0)
      throw new UserMessageException(__('Invalid data', 'utvg'));

    foreach ($this->albumIDs as $albumID)
    {
      if (!$albumID)
        throw new UserMessageException(__('Invalid albumID value', 'utvg'));
    }
  }
}
