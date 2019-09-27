<?php

namespace UTubeVideoGallery\Repository;

use UTubeVideoGallery\Entity\Playlist;

class PlaylistRepository
{
  /* Playlist Items contain album name from album table */

  public function getItem($playlistID)
  {
    global $wpdb;

    if (!$playlistID)
      return false;

    $query = $wpdb->prepare(
      'SELECT p.*, ALB_NAME
      FROM ' . $wpdb->prefix . 'utubevideo_playlist p
      INNER JOIN ' . $wpdb->prefix . 'utubevideo_album a ON p.ALB_ID = a.ALB_ID
      WHERE PLAY_ID = %d',
      $playlistID
    );

    $playlistData = $wpdb->get_row($query);

    if ($playlistData)
      return new Playlist($playlistData);

    return false;
  }

  public function getItems()
  {
    global $wpdb;
    $data = [];

    $playlistsData = $wpdb->get_results(
      'SELECT p.*, ALB_NAME
      FROM ' . $wpdb->prefix . 'utubevideo_playlist p
      INNER JOIN ' . $wpdb->prefix . 'utubevideo_album a ON p.ALB_ID = a.ALB_ID
      ORDER BY PLAY_ID'
    );

    foreach ($playlistsData as $playlistData)
      $data[] = new Playlist($playlistData);

    return $data;
  }

  public function createItem(
    $title,
    $source,
    $sourceID,
    $videoQuality,
    $showControls,
    $albumID
  )
  {
    global $wpdb;

    $currentTime = current_time('timestamp');

    //insert new playlist
    if ($wpdb->insert(
      $wpdb->prefix . 'utubevideo_playlist',
      [
        'PLAY_TITLE' => $title,
        'PLAY_SOURCE' => $source,
        'PLAY_SOURCEID' => $sourceID,
        'PLAY_QUALITY' => $videoQuality,
        'PLAY_CHROME' => $showControls,
        'PLAY_UPDATEDATE' => $currentTime,
        'ALB_ID' => $albumID
      ]
    ))
      return $wpdb->insert_id;

    return false;
  }

  public function deleteItem($playlistID)
  {
    global $wpdb;

    if ($wpdb->delete(
      $wpdb->prefix . 'utubevideo_playlist',
      ['PLAY_ID' => $playlistID]
    ) !== false)
      return true;

    return false;
  }

  public function updateItem($playlistID, $updatedFields)
  {
    global $wpdb;

    if ($wpdb->update(
      $wpdb->prefix . 'utubevideo_playlist',
      $updatedFields,
      ['PLAY_ID' => $playlistID]
    ) >= 0)
      return true;

    return false;
  }
}
