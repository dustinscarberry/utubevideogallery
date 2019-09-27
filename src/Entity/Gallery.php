<?php

namespace UTubeVideoGallery\Entity;

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

  public function __construct($dbRow)
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

  public function getID()
  {
    return $this->id;
  }

  public function getTitle()
  {
    return $this->title;
  }

  public function getSortDirection()
  {
    return $this->sortDirection;
  }

  public function getDisplayType()
  {
    return $this->displayType;
  }

  public function getThumbnailType()
  {
    return $this->thumbnailType;
  }

  public function getUpdateDate()
  {
    return $this->updateDate;
  }

  public function getAlbumCount()
  {
    return $this->albumCount;
  }

  public function jsonSerialize()
  {
    return get_object_vars($this);
  }
}
