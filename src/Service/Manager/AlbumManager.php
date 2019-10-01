<?php

namespace UTubeVideoGallery\Service\Manager;

use UTubeVideoGallery\Repository\AlbumRepository;
use UTubeVideoGallery\Repository\VideoRepository;
use UTubeVideoGallery\Exception\UserMessageException;

class AlbumManager
{
  //get album
  public static function getAlbum($albumID)
  {
    //get album
    $album = AlbumRepository::getItem($albumID);

    //check if album exists
    if (!$album)
      throw new UserMessageException(__('The specified album resource was not found', 'utvg'));

    return $album;
  }

  //get all albums
  public static function getAlbums()
  {
    return AlbumRepository::getItems();
  }

  //get albums in gallery
  public static function getGalleryAlbums($galleryID)
  {
    return AlbumRepository::getItemsByGallery($galleryID);
  }

  //create album
  public static function createAlbum($form)
  {
    //get next album sort position
    $nextSortPosition = AlbumRepository::getNextSortPositionByGallery($form->getGalleryID());

    //generate slug and store for possible use in future [LEGACY]
    $slug = self::generateSlug($form->getTitle());

    //insert new album
    $albumID = AlbumRepository::createItem(
      $form->getTitle(),
      $slug,
      $form->getVideoSorting(),
      $nextSortPosition,
      $form->getGalleryID()
    );

    //if failure to create
    if (!$albumID)
      throw new UserMessageException(__('A database error has occurred', 'utvg'));
  }

  //update album
  public static function updateAlbum($form)
  {
    //update album
    if (!AlbumRepository::updateItem($form))
      throw new UserMessageException(__('A database error has occurred', 'utvg'));
  }

  //delete album
  public static function deleteAlbum($albumID)
  {
    //get all videos in album
    $albumVideos = VideoRepository::getItemsByAlbum($albumID);

    //delete album and videos from database
    if (
      !VideoRepository::deleteItemsByAlbum($albumID)
      || !AlbumRepository::deleteItem($albumID)
    )
      throw new UserMessageException(__('A database error has occurred', 'utvg'));

    //delete thumbnails
    $thumbnailPath = wp_upload_dir();
    $thumbnailPath = $thumbnailPath['basedir'] . '/utubevideo-cache/';

    //delete video thumbnails
    foreach ($albumVideos as $video)
    {
      unlink($thumbnailPath . $video->getThumbnail() . '.jpg');
      unlink($thumbnailPath . $video->getThumbnail() . '@2x.jpg');
    }
  }

  //generate album permalink slug [LEGACY]
  private static function generateSlug($albumName)
  {
    global $wpdb;

    $rawslugs = $wpdb->get_results(
      'SELECT ALB_SLUG
      FROM ' . $wpdb->prefix . 'utubevideo_album',
      ARRAY_N
    );

    foreach ($rawslugs as $item)
      $sluglist[] = $item[0];

    $mark = 1;
    $slug = strtolower($albumName);
    $slug = str_replace(' ', '-', $slug);
    $slug = html_entity_decode($slug, ENT_QUOTES, 'UTF-8');
    $slug = preg_replace("/[^a-zA-Z0-9-]+/", '', $slug);

    if (!empty($sluglist))
      self::checkslug($slug, $sluglist, $mark);

    return $slug;
  }

  //recursive function for making sure slugs are unique [LEGACY]
  private static function checkslug($slug, $sluglist, $mark)
  {
    if (in_array($slug, $sluglist))
    {
      $slug = $slug . '-' . $mark;
      $mark++;
      self::checkslug($slug, $sluglist, $mark);
    }
    else
      return;
  }
}
