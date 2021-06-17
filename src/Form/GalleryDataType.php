<?php

namespace Dscarberry\UTubeVideoGallery\Form;

use Dscarberry\UTubeVideoGallery\Exception\UserMessageException;

class GalleryDataType
{
  private $galleryID;

  function __construct($req)
  {
    if (isset($req['galleryID']))
      $this->galleryID = sanitize_key($req['galleryID']);
  }

  function getGalleryID()
  {
    return $this->galleryID;
  }

  // validate form
  function validate()
  {
    // check for valid galleryID
    if (!$this->galleryID)
      throw new UserMessageException(__('Invalid gallery ID', 'utvg'));
  }
}
