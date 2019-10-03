<?php

namespace UTubeVideoGallery\Repository;

use UTubeVideoGallery\Entity\Album;

class AlbumRepository
{
  public static function getItem($albumID)
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

    if ($albumData)
    {
      $albumData->VIDEO_COUNT = $videoCount;
      return new Album($albumData);
    }

    return false;
  }

  public static function getItems()
  {
    global $wpdb;
    $data = [];

    $albumsData = $wpdb->get_results(
      'SELECT *
      FROM ' . $wpdb->prefix . 'utubevideo_album
      ORDER BY ALB_POS'
    );

    foreach ($albumsData as $albumData)
    {
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

  public static function createItem(
    $title,
    $slug,
    $videoSorting,
    $nextSortPosition,
    $galleryID
  )
  {
    global $wpdb;

    $currentTime = current_time('timestamp');

    //insert new album
    if ($wpdb->insert(
      $wpdb->prefix . 'utubevideo_album',
      [
        'ALB_NAME' => $title,
        'ALB_SLUG' => $slug,
        'ALB_THUMB' => 'missing',
        'ALB_SORT' => $videoSorting,
        'ALB_UPDATEDATE' => $currentTime,
        'ALB_POS' => $nextSortPosition,
        'DATA_ID' => $galleryID
      ]
    ))
      return $wpdb->insert_id;

    return false;
  }

  public static function deleteItem($albumID)
  {
    global $wpdb;

    //delete album from database
    if ($wpdb->delete(
      $wpdb->prefix . 'utubevideo_album',
      ['ALB_ID' => $albumID]
    ) !== false)
      return true;

    return false;
  }

  public static function updateItem($form)
  {
    global $wpdb;

    //create updatedFields array
    $updatedFields = [];

    //set optional update fields
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

    //set required update fields
    $updatedFields['ALB_UPDATEDATE'] = current_time('timestamp');

    if ($wpdb->update(
      $wpdb->prefix . 'utubevideo_album',
      $updatedFields,
      ['ALB_ID' => $form->getAlbumID()]
    ) >= 0)
      return true;

    return false;
  }

  public static function updateItemPosition($albumID, $position)
  {
    global $wpdb;

    $wpdb->update(
      $wpdb->prefix . 'utubevideo_album',
      ['ALB_POS' => $position],
      ['ALB_ID' => $albumID]
    );
  }

  public static function getItemsByGallery($galleryID)
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

    foreach ($albumsData as $albumData)
    {
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

  public static function getPublishedItemsByGallery($galleryID, $sortDirection = 'desc')
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

    foreach ($albumsData as $albumData)
    {
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

  public static function deleteItemsByGallery($galleryID)
  {
    global $wpdb;

    if ($wpdb->delete(
      $wpdb->prefix . 'utubevideo_album',
      ['DATA_ID' => $galleryID]
    ) !== false)
      return true;

    return false;
  }

  public static function getNextSortPositionByGallery($galleryID)
  {
    global $wpdb;

    //check for valid galleryID
    if (!$galleryID)
      return false;

    $query = $wpdb->prepare(
      'SELECT COUNT(ALB_ID) AS ALBUM_COUNT
      FROM ' . $wpdb->prefix . 'utubevideo_album
      WHERE DATA_ID = %d',
      $galleryID
    );

    //get next sort position for gallery
    $nextSortPosition = $wpdb->get_var($query);

    if (!$nextSortPosition)
      $nextSortPosition = 0;

    return $nextSortPosition;
  }
}
