<?php

namespace CodeClouds\UTubeVideoGallery\Form;

use CodeClouds\UTubeVideoGallery\Exception\UserMessageException;

class GalleryDataType
{
  private $galleryID;

  public function __construct($req)
  {
    if (isset($req['galleryID']))
      $this->galleryID = sanitize_key($req['galleryID']);
  }

  public function getGalleryID()
  {
    return $this->galleryID;
  }

  public function validate()
  {
    //check for valid galleryID
    if (!$this->galleryID)
      throw new UserMessageException(__('Invalid gallery ID', 'utvg'));
  }
}
