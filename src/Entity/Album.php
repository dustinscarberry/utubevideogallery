<?php

namespace Dscarberry\UTubeVideoGallery\Entity;

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

  function __construct($dbRow)
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

  function getID()
  {
    return $this->id;
  }

  function getTitle()
  {
    return $this->title;
  }

  function getSlug()
  {
    return $this->slug;
  }

  function getThumbnail()
  {
    return $this->thumbnail;
  }

  function getSortDirection()
  {
    return $this->sortDirection;
  }

  function getPosition()
  {
    return $this->position;
  }

  function getPublished()
  {
    return $this->published;
  }

  function getUpdateDate()
  {
    return $this->updateDate;
  }

  function getVideoCount()
  {
    return $this->videoCount;
  }

  function getGalleryID()
  {
    return $this->galleryID;
  }

  function jsonSerialize()
  {
    return get_object_vars($this);
  }
}
