<?php

namespace UTubeVideoGallery\Service\Manager;

use UTubeVideoGallery\Repository\GalleryRepository;
use UTubeVideoGallery\Repository\AlbumRepository;
use UTubeVideoGallery\Repository\VideoRepository;
use UTubeVideoGallery\Exception\UserMessageException;

class GalleryDataManager
{
  public static function getGalleryData($form)
  {
    //initialize variables
    $thumbnailDirectory = wp_upload_dir();
    $thumbnailDirectory = $thumbnailDirectory['baseurl'];
    $data = new \stdClass();

    //get gallery
    $gallery = GalleryRepository::getItem($form->getGalleryID());

    //map gallery data
    $data->ID = $gallery->getID();
    $data->name = $gallery->getTitle();
    $data->displaytype = $gallery->getDisplayType();
    $data->thumbnailType = $gallery->getThumbnailType();
    $data->albumsort = $gallery->getSortDirection();
    $data->albums = [];

    //get albums in gallery
    $albums = AlbumRepository::getPublishedItemsByGallery(
      $form->getGalleryID(),
      $gallery->getSortDirection()
    );

    foreach ($albums as $album)
    {
      //map album data
      $albumData = new \stdClass();
      $albumData->ID = $album->getID();
      $albumData->title = $album->getTitle();
      $albumData->slug = $album->getSlug();
      $albumData->thumbnail = $thumbnailDirectory . '/utubevideo-cache/' . $album->getThumbnail() . '.jpg';
      $albumData->sort = $album->getSortDirection();
      $albumData->position = $album->getPosition();
      $albumData->videos = [];

      //get videos for album
      $videos = VideoRepository::getPublishedItemsByAlbum(
        $album->getID(),
        $album->getSortDirection()
      );

      //map video data
      foreach ($videos as $video)
      {
        $videoData = new \stdClass();
        $videoData->ID = $video->getID();
        $videoData->title = $video->getTitle();
        $videoData->description = $video->getDescription();
        $videoData->slugID = $video->getSourceID();
        $videoData->thumbnail = $thumbnailDirectory . '/utubevideo-cache/' . $video->getThumbnail() . '.jpg';
        $videoData->source = $video->getSource();
        $videoData->quality = $video->getQuality();
        $videoData->chrome = ($video->getShowControls() == 1 ? true : false);
        $videoData->startTime = $video->getStartTime();
        $videoData->endTime = $video->getEndTime();

        //add video to album
        $albumData->videos[] = $videoData;
      }

      //add album to gallery
      $data->albums[] = $albumData;
    }

    return $data;
  }
}
