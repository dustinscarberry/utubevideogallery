<?php

namespace UTubeVideoGallery\Entity;

use JsonSerializable;

class Playlist implements JsonSerializable
{
  private $id;
  private $title;
  private $source;
  private $sourceID;
  private $videoQuality;
  private $showControls;
  private $updateDate;
  private $albumID;
  private $albumName;

  public function __construct($dbRow)
  {
    $this->mapData($dbRow);
  }

  private function mapData($dbRow)
  {
    $this->id = $dbRow->PLAY_ID;
    $this->title = $dbRow->PLAY_TITLE;
    $this->source = $dbRow->PLAY_SOURCE;
    $this->sourceID = $dbRow->PLAY_SOURCEID;
    $this->videoQuality = $dbRow->PLAY_QUALITY;
    $this->showControls = $dbRow->PLAY_CHROME ? true : false;
    $this->updateDate = $dbRow->PLAY_UPDATEDATE;
    $this->albumID = $dbRow->ALB_ID;
    $this->albumName = $dbRow->ALB_NAME;
  }

  public function getID()
  {
    return $this->id;
  }

  public function getTitle()
  {
    return $this->title;
  }

  public function getSource()
  {
    return $this->source;
  }

  public function getSourceID()
  {
    return $this->sourceID;
  }

  public function getVideoQuality()
  {
    return $this->quality;
  }

  public function getShowControls()
  {
    return $this->showControls;
  }

  public function getUpdateDate()
  {
    return $this->updateDate;
  }

  public function getAlbumID()
  {
    return $this->albumID;
  }

  public function getAlbumName()
  {
    return $this->albumName;
  }

  public function jsonSerialize()
  {
    return get_object_vars($this);
  }
}
