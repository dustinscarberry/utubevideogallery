<?php

namespace Dscarberry\UTubeVideoGallery\Repository;

use Dscarberry\UTubeVideoGallery\Entity\Gallery;

class GalleryRepository
{
  // get gallery
  public static function getItem(int $galleryID)
  {
    global $wpdb;

    if (!$galleryID)
      return false;

    $galleryQuery = $wpdb->prepare(
      'SELECT *
      FROM ' . $wpdb->prefix . 'utubevideo_dataset
      WHERE DATA_ID = %d',
      $galleryID
    );

    $albumCountQuery = $wpdb->prepare(
      'SELECT COUNT(ALB_ID) AS ALBUM_COUNT
      FROM ' . $wpdb->prefix . 'utubevideo_album
      WHERE DATA_ID = %d',
      $galleryID
    );

    $galleryData = $wpdb->get_row($galleryQuery);
    $albumCount = $wpdb->get_var($albumCountQuery);

    if (!$albumCount)
      $albumCount = 0;

    if (!$galleryData)
      return false;

    $galleryData->ALBUM_COUNT = $albumCount;
    return new Gallery($galleryData);
  }

  // get all galleries
  public static function getItems()
  {
    global $wpdb;
    $data = [];

    $galleriesData = $wpdb->get_results(
      'SELECT *
      FROM ' . $wpdb->prefix . 'utubevideo_dataset
      ORDER BY DATA_ID'
    );

    foreach ($galleriesData as $galleryData) {
      $albumCount = $wpdb->get_var(
        'SELECT COUNT(ALB_ID) AS ALBUM_COUNT
        FROM ' . $wpdb->prefix . 'utubevideo_album
        WHERE DATA_ID = ' . $galleryData->DATA_ID
      );

      if (!$albumCount)
        $albumCount = 0;

      $galleryData->ALBUM_COUNT = $albumCount;
      $data[] = new Gallery($galleryData);
    }

    return $data;
  }

  // create gallery
  public static function createItem(
    $title,
    $albumSorting,
    $thumbnailType,
    $displayType
  )
  {
    global $wpdb;

    // insert new gallery
    if ($wpdb->insert(
      $wpdb->prefix . 'utubevideo_dataset',
      [
        'DATA_NAME' => $title,
        'DATA_SORT' => $albumSorting,
        'DATA_THUMBTYPE' => $thumbnailType,
        'DATA_DISPLAYTYPE' => $displayType,
        'DATA_UPDATEDATE' => current_time('timestamp')
      ]
    ))
      return $wpdb->insert_id;

    return false;
  }

  // delete gallery
  public static function deleteItem(int $galleryID)
  {
    global $wpdb;

    if ($wpdb->delete(
      $wpdb->prefix . 'utubevideo_dataset',
      ['DATA_ID' => $galleryID]
    ) != false)
      return true;

    return false;
  }

  // update gallery
  public static function updateItem($form)
  {
    global $wpdb;

    // create updatedFields array
    $updatedFields = [];

    // set optional update fields
    if ($form->getTitle() != null)
      $updatedFields['DATA_NAME'] = $form->getTitle();

    if ($form->getThumbnailType() != null)
      $updatedFields['DATA_THUMBTYPE'] = $form->getThumbnailType();

    if ($form->getDisplayType() != null)
      $updatedFields['DATA_DISPLAYTYPE'] = $form->getDisplayType();

    if ($form->getAlbumSorting() != null)
      $updatedFields['DATA_SORT'] = $form->getAlbumSorting();

    // set required update fields
    $updatedFields['DATA_UPDATEDATE'] = current_time('timestamp');

    // update database entry
    if ($wpdb->update(
      $wpdb->prefix . 'utubevideo_dataset',
      $updatedFields,
      ['DATA_ID' => $form->getGalleryID()]
    ) >= 0)
      return true;

    return false;
  }
}
