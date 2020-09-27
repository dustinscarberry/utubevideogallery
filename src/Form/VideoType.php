<?php

namespace CodeClouds\UTubeVideoGallery\Form;

use WP_REST_Request;
use CodeClouds\UTubeVideoGallery\Exception\UserMessageException;

class VideoType
{
  private $sourceID;
  private $title;
  private $description;
  private $quality;
  private $showControls;
  private $startTime;
  private $endTime;
  private $source;
  private $albumID;
  private $playlistID;
  private $videoID;
  private $published;
  private $skipThumbnailRender;
  private $galleryID;

  public function __construct(WP_REST_Request $req)
  {
    if (isset($req['sourceID']))
      $this->sourceID = sanitize_text_field($req['sourceID']);

    if (isset($req['title']))
      $this->title = sanitize_text_field($req['title']);

    if (isset($req['description']))
      $this->description = sanitize_text_field($req['description']);

    if (isset($req['quality']))
      $this->quality = sanitize_text_field($req['quality']);

    if (isset($req['showControls']))
      $this->showControls = ($req['showControls'] ? 1 : 0);

    if (isset($req['startTime']))
      $this->startTime = sanitize_text_field($req['startTime']);

    if (isset($req['endTime']))
      $this->endTime = sanitize_text_field($req['endTime']);

    if (isset($req['playlistID']))
      $this->playlistID = sanitize_key($req['playlistID']);

    if (isset($req['albumID']))
      $this->albumID = sanitize_key($req['albumID']);

    if (isset($req['source']))
      $this->source = sanitize_text_field($req['source']);

    if (isset($req['videoID']))
      $this->videoID = sanitize_key($req['videoID']);

    if (isset($req['published']))
      $this->published = ($req['published'] ? 1 : 0);

    if (isset($req['skipThumbnailRender']))
      $this->skipThumbnailRender = $req['skipThumbnailRender'] ? true : false;

    if (isset($req['galleryID']))
      $this->galleryID = sanitize_key($req['galleryID']);
  }

  public function getSourceID()
  {
    return $this->sourceID;
  }

  public function getTitle()
  {
    return $this->title;
  }

  public function getDescription()
  {
    return $this->description;
  }

  public function getQuality()
  {
    return $this->quality;
  }

  public function getShowControls()
  {
    return $this->showControls;
  }

  public function getStartTime()
  {
    return ($this->startTime == '' ? null : $this->startTime);
  }

  public function getEndTime()
  {
    return ($this->endTime == '' ? null : $this->endTime);
  }

  public function getSource()
  {
    return $this->source;
  }

  public function getAlbumID()
  {
    return $this->albumID;
  }

  public function getPlaylistID()
  {
    return $this->playlistID;
  }

  public function getVideoID()
  {
    return $this->videoID;
  }

  public function getPublished()
  {
    return $this->published;
  }

  public function getSkipThumbnailRender()
  {
    return $this->skipThumbnailRender;
  }

  public function getGalleryID()
  {
    return $this->galleryID;
  }

  //validate form specific cases
  public function validate(string $action)
  {
    if ($action == 'create')
      $this->validateCreate();
    else if ($action == 'update')
      $this->validateUpdate();
    else if ($action == 'delete')
      $this->validateDelete();
    else if ($action == 'get')
      $this->validateGet();
    else if ($action == 'getAlbum')
      $this->validateGetAlbum();
    else if ($action == 'getGallery')
      $this->validateGetGallery();
  }

  private function validateGet()
  {
    //check for valid videoID
    if ($this->videoID === null)
      throw new UserMessageException(__('Invalid videoID', 'utvg'));
  }

  private function validateGetAlbum()
  {
    //check for valid albumID
    if ($this->albumID === null)
      throw new UserMessageException(__('Invalid albumID', 'utvg'));
  }

  private function validateGetGallery()
  {
    //check for valid galleryID
    if ($this->galleryID === null)
      throw new UserMessageException(__('Invalid galleryID', 'utvg'));
  }

  private function validateCreate()
  {
    //check for required fields
    if (
      empty($this->sourceID)
      || empty($this->quality)
      || !isset($this->showControls)
      || empty($this->source)
      || !isset($this->albumID)
    )
      throw new UserMessageException(__('Invalid parameters', 'utvg'));
  }

  private function validateUpdate()
  {
    //check for valid videoID
    if (!$this->videoID)
      throw new UserMessageException(__('Invalid video ID', 'utvg'));
  }

  private function validateDelete()
  {
    //check for valid videoID
    if (!$this->videoID)
      throw new UserMessageException(__('Invalid video ID', 'utvg'));
  }
}
