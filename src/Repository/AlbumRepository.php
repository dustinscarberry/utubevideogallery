<?php

namespace CodeClouds\UTubeVideoGallery\Repository;

use CodeClouds\UTubeVideoGallery\Entity\Album;

class AlbumRepository
{
  // get album
  static function getItem(int $albumID)
  {
    global $wpdb;

    if (!$albumID)
      return false;

    $albumQuery = $wpdb->prepare(
      'SELECT *
      FROM ' . $wpdb->prefix . 'utubevideo_album
      WHERE ALB_ID = %d',
      $albumID
    );

    $videoCountQuery = $wpdb->prepare(
      'SELECT count(VID_ID) as VIDEO_COUNT
      FROM ' . $wpdb->prefix . 'utubevideo_video
      WHERE ALB_ID = %d',
      $albumID
    );

    $albumData = $wpdb->get_row($albumQuery);
    $videoCount = $wpdb->get_var($videoCountQuery);

    if (!$videoCount)
      $videoCount = 0;

    if (!$albumData)
      return false;

    $albumData->VIDEO_COUNT = $videoCount;
    return new Album($albumData);
  }

  // get all albums
  static function getItems()
  {
    global $wpdb;
    $data = [];

    $albumsData = $wpdb->get_results(
      'SELECT *
      FROM ' . $wpdb->prefix . 'utubevideo_album
      ORDER BY ALB_POS'
    );

    foreach ($albumsData as $albumData) {
      $videoCount = $wpdb->get_var(
        'SELECT count(VID_ID) as VIDEO_COUNT
        FROM ' . $wpdb->prefix . 'utubevideo_video
        WHERE ALB_ID = ' . $albumData->ALB_ID
      );

      if (!$videoCount)
        $videoCount = 0;

      $albumData->VIDEO_COUNT = $videoCount;
      $data[] = new Album($albumData);
    }

    return $data;
  }

  // create album
  static function createItem(
    $title,
    $slug,
    $videoSorting,
    $nextSortPosition,
    $galleryID
  )
  {
    global $wpdb;

    // insert new album
    if ($wpdb->insert(
      $wpdb->prefix . 'utubevideo_album',
      [
        'ALB_NAME' => $title,
        'ALB_SLUG' => $slug,
        'ALB_THUMB' => 'missing',
        'ALB_SORT' => $videoSorting,
        'ALB_UPDATEDATE' => current_time('timestamp'),
        'ALB_POS' => $nextSortPosition,
        'DATA_ID' => $galleryID
      ]
    ))
      return $wpdb->insert_id;

    return false;
  }

  // delete album
  static function deleteItem(int $albumID)
  {
    global $wpdb;

    // delete album from database
    if ($wpdb->delete(
      $wpdb->prefix . 'utubevideo_album',
      ['ALB_ID' => $albumID]
    ) !== false)
      return true;

    return false;
  }

  // update album
  static function updateItem($form)
  {
    global $wpdb;

    // create updatedFields array
    $updatedFields = [];

    // set optional update fields
    if ($form->getTitle() != null)
      $updatedFields['ALB_NAME'] = $form->getTitle();

    if ($form->getThumbnail() != null)
      $updatedFields['ALB_THUMB'] = $form->getThumbnail();

    if ($form->getVideoSorting() != null)
      $updatedFields['ALB_SORT'] = $form->getVideoSorting();

    if ($form->getPublished() !== null)
      $updatedFields['ALB_PUBLISH'] = $form->getPublished();

    if ($form->getGalleryID() != null)
      $updatedFields['DATA_ID'] = $form->getGalleryID();

    // set required update fields
    $updatedFields['ALB_UPDATEDATE'] = current_time('timestamp');

    if ($wpdb->update(
      $wpdb->prefix . 'utubevideo_album',
      $updatedFields,
      ['ALB_ID' => $form->getAlbumID()]
    ) >= 0)
      return true;

    return false;
  }

  // update album sort position
  static function updateItemPosition(int $albumID, int $position)
  {
    global $wpdb;

    if ($wpdb->update(
      $wpdb->prefix . 'utubevideo_album',
      ['ALB_POS' => $position],
      ['ALB_ID' => $albumID]
    ) !== false)
      return true;

    return false;
  }

  // get all albums in a gallery
  static function getItemsByGallery(int $galleryID)
  {
    global $wpdb;
    $data = [];

    if (!$galleryID)
      return false;

    $albumsQuery = $wpdb->prepare(
      'SELECT *
      FROM ' . $wpdb->prefix . 'utubevideo_album
      WHERE DATA_ID = %d
      ORDER BY ALB_POS',
      $galleryID
    );

    $albumsData = $wpdb->get_results($albumsQuery);

    foreach ($albumsData as $albumData) {
      $videoCount = $wpdb->get_var(
        'SELECT count(VID_ID) as VIDEO_COUNT
        FROM ' . $wpdb->prefix . 'utubevideo_video
        WHERE ALB_ID = ' . $albumData->ALB_ID
      );

      if (!$videoCount)
        $videoCount = 0;

      $albumData->VIDEO_COUNT = $videoCount;
      $data[] = new Album($albumData);
    }

    return $data;
  }

  // get all published albums in a gallery
  static function getPublishedItemsByGallery(int $galleryID, string $sortDirection = 'desc')
  {
    global $wpdb;
    $data = [];

    if (!$galleryID)
      return false;

    $albumsQuery = $wpdb->prepare(
      'SELECT *
      FROM ' . $wpdb->prefix . 'utubevideo_album
      WHERE DATA_ID = %d
      && ALB_PUBLISH = 1
      ORDER BY ALB_POS ' . $sortDirection,
      $galleryID
    );

    $albumsData = $wpdb->get_results($albumsQuery);

    foreach ($albumsData as $albumData) {
      $videoCount = $wpdb->get_var(
        'SELECT count(VID_ID) as VIDEO_COUNT
        FROM ' . $wpdb->prefix . 'utubevideo_video
        WHERE ALB_ID = ' . $albumData->ALB_ID
      );

      if (!$videoCount)
        $videoCount = 0;

      $albumData->VIDEO_COUNT = $videoCount;
      $data[] = new Album($albumData);
    }

    return $data;
  }

  // delete all albums in a gallery
  static function deleteItemsByGallery(int $galleryID)
  {
    global $wpdb;

    if ($wpdb->delete(
      $wpdb->prefix . 'utubevideo_album',
      ['DATA_ID' => $galleryID]
    ) !== false)
      return true;

    return false;
  }

  // get next album sort position in a gallery
  static function getNextSortPositionByGallery(int $galleryID)
  {
    global $wpdb;

    // check for valid galleryID
    if (!$galleryID)
      return false;

    $query = $wpdb->prepare(
      'SELECT COUNT(ALB_ID) AS ALBUM_COUNT
      FROM ' . $wpdb->prefix . 'utubevideo_album
      WHERE DATA_ID = %d',
      $galleryID
    );

    // get next sort position for gallery
    $nextSortPosition = $wpdb->get_var($query);

    if (!$nextSortPosition)
      $nextSortPosition = 0;

    return $nextSortPosition;
  }
}
