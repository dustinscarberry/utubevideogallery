<?php

namespace Dscarberry\UTubeVideoGallery\Repository;

use Dscarberry\UTubeVideoGallery\Entity\Playlist;

class PlaylistRepository
{
  // get playlist
  static function getItem(int $playlistID)
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

    if (!$playlistData)
      return false;

    return new Playlist($playlistData);
  }

  // get playlists
  static function getItems()
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

  // create playlist
  static function createItem(
    $title,
    $source,
    $sourceID,
    $videoQuality,
    $showControls,
    $albumID
  )
  {
    global $wpdb;

    // insert new playlist
    if ($wpdb->insert(
      $wpdb->prefix . 'utubevideo_playlist',
      [
        'PLAY_TITLE' => $title,
        'PLAY_SOURCE' => $source,
        'PLAY_SOURCEID' => $sourceID,
        'PLAY_QUALITY' => $videoQuality,
        'PLAY_CHROME' => $showControls,
        'PLAY_UPDATEDATE' => current_time('timestamp'),
        'ALB_ID' => $albumID
      ]
    ))
      return $wpdb->insert_id;

    return false;
  }

  // delete playlist
  static function deleteItem(int $playlistID)
  {
    global $wpdb;

    if ($wpdb->delete(
      $wpdb->prefix . 'utubevideo_playlist',
      ['PLAY_ID' => $playlistID]
    ) !== false)
      return true;

    return false;
  }

  // update playlist
  static function updateItem($form)
  {
    global $wpdb;

    // create updatedFields array
    $updatedFields = [];

    // set optional update fields
    if ($form->getTitle() != null)
      $updatedFields['PLAY_TITLE'] = $form->getTitle();

    if ($form->getVideoQuality() != null)
      $updatedFields['PLAY_QUALITY'] = $form->getVideoQuality();

    if ($form->getShowControls() !== null)
      $updatedFields['PLAY_CHROME'] = $form->getShowControls();

    // set required update fields
    $updatedFields['PLAY_UPDATEDATE'] = current_time('timestamp');

    if ($wpdb->update(
      $wpdb->prefix . 'utubevideo_playlist',
      $updatedFields,
      ['PLAY_ID' => $form->getPlaylistID()]
    ) >= 0)
      return true;

    return false;
  }
}
