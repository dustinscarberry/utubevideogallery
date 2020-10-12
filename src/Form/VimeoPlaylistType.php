<?php

namespace CodeClouds\UTubeVideoGallery\Form;

use WP_REST_Request;
use CodeClouds\UTubeVideoGallery\Exception\UserMessageException;

class VimeoPlaylistType
{
  private $sourceID;

  function __construct(WP_REST_Request $req)
  {
    if (isset($req['sourceID']))
      $this->sourceID = sanitize_text_field($req['sourceID']);
  }

  function getSourceID()
  {
    return $this->sourceID;
  }

  // validate form
  function validate()
  {
    // check for valid sourceID
    if (!$this->sourceID)
      throw new UserMessageException(__('Invalid source ID', 'utvg'));
  }
}
