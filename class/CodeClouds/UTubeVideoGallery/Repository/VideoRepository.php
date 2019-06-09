<?php

namespace CodeClouds\UTubeVideoGallery\Repository;

use CodeClouds\UTubeVideoGallery\Entity\Video;

class VideoRepository
{
  public function getItem($videoID)
  {
    global $wpdb;

    if (!$videoID)
      return false;

    $query = $wpdb->prepare(
      'SELECT *
      FROM ' . $wpdb->prefix . 'utubevideo_video
      WHERE VID_ID = %d',
      $videoID
    );

    $videoData = $wpdb->get_row($query);

    if ($videoData)
      return new Video($videoData);

    return false;
  }

  public function getItems()
  {
    global $wpdb;
    $data = [];

    $videosData = $wpdb->get_results(
      'SELECT *
      FROM ' . $wpdb->prefix . 'utubevideo_video
      ORDER BY VID_ID'
    );

    foreach ($videosData as $videoData)
      $data[] = new Video($videoData);

    return $data;
  }

  public function createItem(
    $source,
    $title,
    $description,
    $sourceID,
    $thumbnailType,
    $quality,
    $showControls,
    $startTime,
    $endTime,
    $nextSortPosition,
    $albumID,
    $playlistID
  )
  {
    global $wpdb;

    $currentTime = current_time('timestamp');

    //insert new video
    if ($wpdb->insert(
      $wpdb->prefix . 'utubevideo_video',
      [
        'VID_SOURCE' => $source,
        'VID_NAME' => $title,
        'VID_DESCRIPTION' => $description,
        'VID_URL' => $sourceID,
        'VID_THUMBTYPE' => $thumbnailType,
        'VID_QUALITY' => $quality,
        'VID_CHROME' => $showControls,
        'VID_STARTTIME' => $startTime,
        'VID_ENDTIME' => $endTime,
        'VID_POS' => $nextSortPosition,
        'VID_UPDATEDATE' => $currentTime,
        'ALB_ID' => $albumID,
        'PLAY_ID' => $playlistID
      ]
    ))
      return $wpdb->insert_id;

    return false;
  }

  public function deleteItem($videoID)
  {
    global $wpdb;

    //delete video from database
    if ($wpdb->delete(
      $wpdb->prefix . 'utubevideo_video',
      ['VID_ID' => $videoID]
    ) !== false)
      return true;

    return false;
  }

  public function updateItem($videoID, $updatedFields)
  {
    global $wpdb;

    if ($wpdb->update(
      $wpdb->prefix . 'utubevideo_video',
      $updatedFields,
      ['VID_ID' => $videoID]
    ) >= 0)
      return true;

    return false;
  }

  public function getItemsByAlbum($albumID)
  {
    global $wpdb;
    $data = [];

    //check for valid albumID
    if (!$albumID)
      return false;

    $query = $wpdb->prepare(
      'SELECT *
      FROM ' . $wpdb->prefix . 'utubevideo_video
      WHERE ALB_ID = %d
      ORDER BY VID_POS',
      $albumID
    );

    $videosData = $wpdb->get_results($query);

    foreach ($videosData as $videoData)
      $data[] = new Video($videoData);

    return $data;
  }

  public function getItemsByPlaylist($playlistID)
  {
    global $wpdb;
    $data = [];

    if (!$playlistID)
      return false;

    $query = $wpdb->prepare(
      'SELECT *
      FROM ' . $wpdb->prefix . 'utubevideo_video
      WHERE PLAY_ID = %d
      ORDER BY VID_POS',
      $playlistID
    );

    $videosData = $wpdb->get_results($query);

    foreach ($videosData as $videoData)
      $data[] = new Video($videoData);

    return $data;
  }

  public function getItemsByGallery($galleryID)
  {
    global $wpdb;
    $data = [];

    $albumIDsQuery = $wpdb->prepare(
      'SELECT ALB_ID
      FROM ' . $wpdb->prefix . 'utubevideo_album
      WHERE DATA_ID = %d',
      $galleryID
    );

    //get albums in gallery
    $albumIDsData = $wpdb->get_results($albumIDsQuery);
    $albumIDs = [-1];

    foreach ($albumIDsData as $albumIDData)
      $albumIDs[] = $albumIDData->ALB_ID;

    $albumsQueryString = implode(', ', $albumIDs);

    $videosData = $wpdb->get_results(
      'SELECT *
      FROM ' . $wpdb->prefix . 'utubevideo_video
      WHERE ALB_ID IN (' . $albumsQueryString . ')'
    );

    foreach ($videosData as $videoData)
      $data[] = new Video($videoData);

    return $data;
  }

  public function getNextSortPositionByAlbum($albumID)
  {
    global $wpdb;

    //check for valid albumID
    if ($albumID === false)
      throw new \Exception(__('Database Error: Invalid album ID', 'utvg'));

    $query = $wpdb->prepare(
      'SELECT COUNT(VID_ID) AS VID_COUNT
      FROM ' . $wpdb->prefix . 'utubevideo_video
      WHERE ALB_ID = %d',
      $albumID
    );

    //get next sort position for album
    $nextSortPosition = $wpdb->get_var($query);

    if ($nextSortPosition === false)
      $nextSortPosition = 0;

    return $nextSortPosition;
  }

  public function getThumbnailTypeByAlbum($albumID = false)
  {
    global $wpdb;

    //check for valid albumID
    if ($albumID === false)
      throw new \Exception(__('Database Error: Invalid album ID', 'utvg'));

    $query = $wpdb->prepare(
      'SELECT DATA_THUMBTYPE
      FROM ' . $wpdb->prefix . 'utubevideo_album a
      INNER JOIN ' . $wpdb->prefix . 'utubevideo_dataset d ON a.DATA_ID = d.DATA_ID
      WHERE a.ALB_ID = %d',
      $albumID
    );

    $thumbnailType = $wpdb->get_var($query);

    if (!$thumbnailType)
      $thumbnailType = 'rectangle';

    return $thumbnailType;
  }

  public function deleteItemsByAlbum($albumID = false)
  {
    global $wpdb;

    //delete videos from database
    if ($wpdb->delete(
      $wpdb->prefix . 'utubevideo_video',
      ['ALB_ID' => $albumID]
    ) !== false)
      return true;

    return false;
  }

  public function deleteItemsByGallery($galleryID)
  {
    global $wpdb;

    $albumIDsQuery = $wpdb->prepare(
      'SELECT ALB_ID
      FROM ' . $wpdb->prefix . 'utubevideo_album
      WHERE DATA_ID = %d',
      $galleryID
    );

    //get albums in gallery
    $albumIDsData = $wpdb->get_results($albumIDsQuery);
    $albumIDs = [-1];

    foreach ($albumIDsData as $albumIDData)
      $albumIDs[] = $albumIDData->ALB_ID;

    $albumsQueryString = implode(', ', $albumIDs);

    if ($wpdb->query(
      'DELETE
      FROM ' . $wpdb->prefix . 'utubevideo_video
      WHERE ALB_ID IN (' . $albumsQueryString . ')'
    ) !== false)
      return true;

    return false;
  }
}
