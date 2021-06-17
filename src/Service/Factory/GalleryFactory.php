<?php

namespace Dscarberry\UTubeVideoGallery\Service\Factory;

use Dscarberry\UTubeVideoGallery\Repository\GalleryRepository;
use Dscarberry\UTubeVideoGallery\Repository\AlbumRepository;
use Dscarberry\UTubeVideoGallery\Repository\VideoRepository;
use Dscarberry\UTubeVideoGallery\Form\GalleryType;
use Dscarberry\UTubeVideoGallery\Exception\UserMessageException;

class GalleryFactory
{
  static function getGallery(int $galleryID)
  {
    //get gallery
    $gallery = GalleryRepository::getItem($galleryID);

    //check if gallery exists
    if (!$gallery)
      throw new UserMessageException(__('The specified gallery resource was not found', 'utvg'));

    return $gallery;
  }

  static function getGalleries()
  {
    return GalleryRepository::getItems();
  }

  static function createGallery(GalleryType $form)
  {
    //insert new gallery
    $galleryID = GalleryRepository::createItem(
      $form->getTitle(),
      $form->getAlbumSorting(),
      $form->getThumbnailType(),
      $form->getDisplayType()
    );

    if (!$galleryID)
      throw new UserMessageException(__('A database error has occurred', 'utvg'));
  }

  static function updateGallery(GalleryType $form)
  {
    //update gallery
    if (!GalleryRepository::updateItem($form))
      throw new UserMessageException(__('A database error has occurred', 'utvg'));
  }

  static function deleteGallery(int $galleryID)
  {
    //get videos for thumbnail deletion
    $videos = VideoRepository::getItemsByGallery($galleryID);

    //delete gallery, albums, and videos from database
    if (
      !VideoRepository::deleteItemsByGallery($galleryID)
      || !AlbumRepository::deleteItemsByGallery($galleryID)
      || !GalleryRepository::deleteItem($galleryID)
    )
      throw new UserMessageException(__('A database error has occured', 'utvg'));

    //delete video thumbnails
    $thumbnailPath = wp_upload_dir();
    $thumbnailPath = $thumbnailPath['basedir'] . '/utubevideo-cache/';

    foreach ($videos as $video)
    {
      unlink($thumbnailPath . $video->getThumbnail() . '.jpg');
      unlink($thumbnailPath . $video->getThumbnail() . '@2x.jpg');
    }
  }
}
