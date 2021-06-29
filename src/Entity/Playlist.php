<?php

namespace Dscarberry\UTubeVideoGallery\Entity;

use JsonSerializable;

class Playlist implements JsonSerializable
{
  private $id;
  private $title;
  private $source;
  private $sourceID;
  private $showControls;
  private $updateDate;
  private $albumID;
  private $albumName;

  function __construct($dbRow)
  {
    $this->mapData($dbRow);
  }

  private function mapData($dbRow)
  {
    $this->id = $dbRow->PLAY_ID;
    $this->title = $dbRow->PLAY_TITLE;
    $this->source = $dbRow->PLAY_SOURCE;
    $this->sourceID = $dbRow->PLAY_SOURCEID;
    $this->showControls = $dbRow->PLAY_CHROME ? true : false;
    $this->updateDate = $dbRow->PLAY_UPDATEDATE;
    $this->albumID = $dbRow->ALB_ID;
    $this->albumName = $dbRow->ALB_NAME;
  }

  function getID()
  {
    return $this->id;
  }

  function getTitle()
  {
    return $this->title;
  }

  function getSource()
  {
    return $this->source;
  }

  function getSourceID()
  {
    return $this->sourceID;
  }

  function getShowControls()
  {
    return $this->showControls;
  }

  function getUpdateDate()
  {
    return $this->updateDate;
  }

  function getAlbumID()
  {
    return $this->albumID;
  }

  function getAlbumName()
  {
    return $this->albumName;
  }

  function jsonSerialize()
  {
    return get_object_vars($this);
  }
}
