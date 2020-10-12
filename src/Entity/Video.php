<?php

namespace CodeClouds\UTubeVideoGallery\Entity;

use JsonSerializable;

class Video implements JsonSerializable
{
  private $id;
  private $title;
  private $description;
  private $source;
  private $thumbnail;
  private $thumbnailType;
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

  function __construct($dbRow)
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
    $this->thumbnailType = $dbRow->THUMBNAIL_TYPE;
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

  function getID()
  {
    return $this->id;
  }

  function getTitle()
  {
    return $this->title;
  }

  function getDescription()
  {
    return $this->description;
  }

  function getSource()
  {
    return $this->source;
  }

  function getThumbnail()
  {
    return $this->thumbnail;
  }

  function getThumbnailType()
  {
    return $this->thumbnailType;
  }

  function getSourceID()
  {
    return $this->sourceID;
  }

  function getQuality()
  {
    return $this->quality;
  }

  function getShowControls()
  {
    return $this->showControls;
  }

  function getStartTime()
  {
    return $this->startTime;
  }

  function getEndTime()
  {
    return $this->endTime;
  }

  function getPosition()
  {
    return $this->positiion;
  }

  function getPublished()
  {
    return $this->published;
  }

  function getUpdateDate()
  {
    return $this->updateDate;
  }

  function getAlbumID()
  {
    return $this->albumID;
  }

  function getPlaylistID()
  {
    return $this->playlistID;
  }

  function jsonSerialize()
  {
    return get_object_vars($this);
  }
}
