<?php

namespace UTubeVideoGallery\Form;

use WP_REST_Request;
use UTubeVideoGallery\Exception\UserMessageException;

class VimeoPlaylistType
{
  private $sourceID;

  public function __construct(WP_REST_Request $req)
  {
    if (isset($req['sourceID']))
      $this->sourceID = sanitize_text_field($req['sourceID']);
  }

  public function getSourceID()
  {
    return $this->sourceID;
  }

  public function validate()
  {
    //check for valid sourceID
    if (!$this->sourceID)
      throw new UserMessageException(__('Invalid source ID', 'utvg'));
  }
}
