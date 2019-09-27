<?php

namespace UTubeVideoGallery\Entity;

use JsonSerializable;

class Video implements JsonSerializable
{
  private $id;
  private $title;
  private $description;
  private $source;
  private $thumbnail;
  private $sourceID;
  private $quality;
  private $showControls;
  private $startTime;
  private $endTime;
  private $position;
  private $published;
  private $updateDate;
  private $albumID;
  private $playlistID;

  public function __construct($dbRow)
  {
    $this->mapData($dbRow);
  }

  private function mapData($dbRow)
  {
    $this->id = $dbRow->VID_ID;
    $this->title = $dbRow->VID_NAME;
    $this->description = $dbRow->VID_DESCRIPTION;
    $this->source = $dbRow->VID_SOURCE;
    $this->thumbnail = $dbRow->VID_URL . $dbRow->VID_ID;
    $this->sourceID = $dbRow->VID_URL;
    $this->quality = $dbRow->VID_QUALITY;
    $this->showControls = $dbRow->VID_CHROME;
    $this->startTime = $dbRow->VID_STARTTIME;
    $this->endTime = $dbRow->VID_ENDTIME;
    $this->position = $dbRow->VID_POS;
    $this->published = $dbRow->VID_PUBLISH;
    $this->updateDate = $dbRow->VID_UPDATEDATE;
    $this->albumID = $dbRow->ALB_ID;
    $this->playlistID = $dbRow->PLAY_ID;
  }

  public function getID()
  {
    return $this->id;
  }

  public function getTitle()
  {
    return $this->title;
  }

  public function getDescription()
  {
    return $this->description;
  }

  public function getSource()
  {
    return $this->source;
  }

  public function getThumbnail()
  {
    return $this->thumbnail;
  }

  public function getSourceID()
  {
    return $this->sourceID;
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
    return $this->startTime;
  }

  public function getEndTime()
  {
    return $this->endTime;
  }

  public function getPosition()
  {
    return $this->positiion;
  }

  public function getPublished()
  {
    return $this->published;
  }

  public function getUpdateDate()
  {
    return $this->updateDate;
  }

  public function getAlbumID()
  {
    return $this->albumID;
  }

  public function getPlaylistID()
  {
    return $this->playlistID;
  }

  public function jsonSerialize()
  {
    return get_object_vars($this);
  }
}
