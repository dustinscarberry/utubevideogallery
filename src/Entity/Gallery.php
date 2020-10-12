<?php

namespace CodeClouds\UTubeVideoGallery\Entity;

use JsonSerializable;

class Gallery implements JsonSerializable
{
  private $id;
  private $title;
  private $sortDirection;
  private $displayType;
  private $thumbnailType;
  private $updateDate;
  private $albumCount;

  function __construct($dbRow)
  {
    $this->mapData($dbRow);
  }

  private function mapData($dbRow)
  {
    $this->id = $dbRow->DATA_ID;
    $this->title = $dbRow->DATA_NAME;
    $this->sortDirection = $dbRow->DATA_SORT;
    $this->displayType = $dbRow->DATA_DISPLAYTYPE;
    $this->thumbnailType = $dbRow->DATA_THUMBTYPE;
    $this->updateDate = $dbRow->DATA_UPDATEDATE;
    $this->albumCount = $dbRow->ALBUM_COUNT;
  }

  function getID()
  {
    return $this->id;
  }

  function getTitle()
  {
    return $this->title;
  }

  function getSortDirection()
  {
    return $this->sortDirection;
  }

  function getDisplayType()
  {
    return $this->displayType;
  }

  function getThumbnailType()
  {
    return $this->thumbnailType;
  }

  function getUpdateDate()
  {
    return $this->updateDate;
  }

  function getAlbumCount()
  {
    return $this->albumCount;
  }

  function jsonSerialize()
  {
    return get_object_vars($this);
  }
}
