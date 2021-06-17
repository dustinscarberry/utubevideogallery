<?php

namespace Dscarberry\UTubeVideoGallery\Form;

use Dscarberry\UTubeVideoGallery\Exception\UserMessageException;
use WP_REST_Request;

class AlbumType
{
  private $title;
  private $videoSorting;
  private $galleryID;
  private $albumID;
  private $thumbnail;
  private $published;

  function __construct(WP_REST_Request $req)
  {
    if (isset($req['title']))
      $this->title = sanitize_text_field($req['title']);

    if (isset($req['videoSorting']))
      $this->videoSorting = ($req['videoSorting'] == 'desc' ? 'desc' : 'asc');

    if (isset($req['galleryID']))
      $this->galleryID = sanitize_key($req['galleryID']);

    if (isset($req['albumID']))
      $this->albumID = sanitize_key($req['albumID']);

    if (isset($req['thumbnail']))
      $this->thumbnail = sanitize_text_field($req['thumbnail']);

    if (isset($req['published']))
      $this->published = ($req['published'] ? true : false);
  }

  function getTitle()
  {
    return $this->title;
  }

  function getVideoSorting()
  {
    return $this->videoSorting;
  }

  function getGalleryID()
  {
    return $this->galleryID;
  }

  function getAlbumID()
  {
    return $this->albumID;
  }

  function getThumbnail()
  {
    return $this->thumbnail;
  }

  function getPublished()
  {
    return $this->published;
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
    else if ($action == 'getGallery')
      $this->validateGetGallery();
  }

  private function validateGet()
  {
    // check for valid albumID
    if (!$this->albumID)
      throw new UserMessageException(__('Invalid albumID', 'utvg'));
  }

  private function validateGetGallery()
  {
    // check for valid galleryID
    if (!$this->galleryID)
      return new UserMessageException(__('Invalid galleryID', 'utvg'));
  }

  private function validateCreate()
  {
    // check for required fields
    if (empty($this->title) || empty($this->videoSorting) || !isset($this->galleryID))
      throw new UserMessageException(__('Invalid parameters', 'utvg'));
  }

  private function validateUpdate()
  {
    // check for valid albumID
    if (!$this->albumID)
      throw new UserMessageException(__('Invalid albumID', 'utvg'));
  }

  private function validateDelete()
  {
    // check for valid albumID
    if (!$this->albumID)
      throw new UserMessageException(__('Invalid albumID', 'utvg'));
  }
}
