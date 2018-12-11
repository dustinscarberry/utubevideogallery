<?php

namespace CodeClouds\UTubeVideoGallery\Entity;

use JsonSerializable;

class Album implements JsonSerializable
{
  private $id;
  private $title;
  private $slug;
  private $thumbnail;
  private $sortDirection;
  private $position;
  private $published;
  private $updateDate;
  private $videoCount;
  private $galleryID;

  public function __construct($dbRow)
  {
    $this->mapData($dbRow);
  }

  private function mapData($dbRow)
  {
    $this->id = $dbRow->ALB_ID;
    $this->title = $dbRow->ALB_NAME;
    $this->slug = $dbRow->ALB_SLUG;
    $this->thumbnail = $dbRow->ALB_THUMB;
    $this->sortDirection = $dbRow->ALB_SORT;
    $this->position = $dbRow->ALB_POS;
    $this->published = $dbRow->ALB_PUBLISH;
    $this->updateDate = $dbRow->ALB_UPDATEDATE;
    $this->videoCount = $dbRow->VIDEO_COUNT;
    $this->galleryID = $dbRow->DATA_ID;
  }

  public function getID()
  {
    return $this->id;
  }

  public function getTitle()
  {
    return $this->title;
  }

  public function getSlug()
  {
    return $this->slug;
  }

  public function getThumbnail()
  {
    return $this->thumbnail;
  }

  public function getSortDirection()
  {
    return $this->sortDirection;
  }

  public function getPosition()
  {
    return $this->position;
  }

  public function getPublished()
  {
    return $this->published;
  }

  public function getUpdateDate()
  {
    return $this->updateDate;
  }

  public function getVideoCount()
  {
    return $this->videoCount;
  }

  public function getGalleryID()
  {
    return $this->galleryID;
  }

  public function jsonSerialize()
  {
    return get_object_vars($this);
  }
}
