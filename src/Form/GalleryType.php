<?php

namespace Dscarberry\UTubeVideoGallery\Form;

use WP_REST_Request;
use Dscarberry\UTubeVideoGallery\Exception\UserMessageException;

class GalleryType
{
  private $galleryID;
  private $title;
  private $albumSorting;
  private $thumbnailType;
  private $displayType;

  function __construct(WP_REST_Request $req)
  {
    if (isset($req['galleryID']))
      $this->galleryID = sanitize_key($req['galleryID']);

    if (isset($req['title']))
      $this->title = sanitize_text_field($req['title']);

    if (isset($req['albumSorting']))
      $this->albumSorting = ($req['albumSorting'] == 'desc' ? 'desc' : 'asc');

    if (isset($req['thumbnailType']))
      $this->thumbnailType = ($req['thumbnailType'] == 'square' ? 'square' : 'rectangle');

    if (isset($req['displayType']))
      $this->displayType = ($req['displayType'] == 'video' ? 'video' : 'album');
  }

  function getGalleryID()
  {
    return $this->galleryID;
  }

  function getTitle()
  {
    return $this->title;
  }

  function getAlbumSorting()
  {
    return $this->albumSorting;
  }

  function getThumbnailType()
  {
    return $this->thumbnailType;
  }

  function getDisplayType()
  {
    return $this->displayType;
  }

  // validate form
  function validate(string $action)
  {
    if ($action == 'create')
      $this->validateCreate();
    else if ($action == 'update')
      $this->validateUpdate();
    else if ($action == 'delete')
      $this->validateDelete();
    else if ($action == 'get')
      $this->validateGet();
  }

  private function validateCreate()
  {
    // check for required fields
    if (empty($this->title)
      || empty($this->albumSorting)
      || empty($this->thumbnailType)
      || empty($this->displayType)
    )
      throw new UserMessageException(__('Invalid parameters', 'utvg'));
  }

  private function validateUpdate()
  {
    // check for valid galleryID
    if (!$this->galleryID)
      throw new UserMessageException(__('Invalid gallery ID', 'utvg'));
  }

  private function validateDelete()
  {
    // check for valid galleryID
    if (!$this->galleryID)
      throw new UserMessageException(__('Invalid gallery ID', 'utvg'));
  }

  private function validateGet()
  {
    // check for valid galleryID
    if (!$this->galleryID)
      throw new UserMessageException(__('Invalid gallery ID', 'utvg'));
  }
}
