<?php

namespace Dscarberry\UTubeVideoGallery\Service\Factory;

use Dscarberry\UTubeVideoGallery\Repository\VideoRepository;
use Dscarberry\UTubeVideoGallery\Service\Factory\ThumbnailFactory;
use Dscarberry\UTubeVideoGallery\Form\VideoType;
use Dscarberry\UTubeVideoGallery\Form\VideoOrderType;
use Dscarberry\UTubeVideoGallery\Exception\UserMessageException;

class VideoFactory
{
  //get video
  static function getVideo(int $videoID)
  {
    //get video
    $video = VideoRepository::getItem($videoID);

    //check if video exists
    if (!$video)
      throw new UserMessageException(__('Database Error: The video does not exist', 'utvg'));

    return $video;
  }

  //get all videos
  static function getVideos()
  {
    return VideoRepository::getItems();
  }

  //get videos in album
  static function getAlbumVideos(int $albumID)
  {
    return VideoRepository::getItemsByAlbum($albumID);
  }

  //get videos in galllery
  static function getGalleryVideos(int $galleryID)
  {
    return VideoRepository::getItemsByGallery($galleryID);
  }

  //create video
  static function createVideo(VideoType $form)
  {
    //get next video sort position
    $nextSortPosition = VideoRepository::getNextSortPositionByAlbum($form->getAlbumID());

    //get video thumbnail type
    $thumbnailType = VideoRepository::getThumbnailTypeByAlbum($form->getAlbumID());

    try
    {
      //insert new video
      $videoID = VideoRepository::createItem($form, $nextSortPosition, $thumbnailType);

      //if successfull video creation..
      if ($videoID) {
        ThumbnailFactory::createThumbnailFromId($videoID);
        return true;
      } else
        throw new UserMessageException(__('Database Error: Video creation failed', 'utvg'));
    }
    catch (\Exception $e)
    {
      //delete video from db due to error if needed
      if (isset($videoID) && $videoID !== false)
        VideoRepository::deleteItem($videoID);

      //rethrow if UserMessageException
      if (get_class($e) == UserMessageException::class)
        throw $e;

      return false;
    }
  }

  // update video
  static function updateVideo(VideoType $form)
  {
    // update video info
    if (!VideoRepository::updateItem($form))
      throw new UserMessageException(__('Database Error: Failed to update video', 'utvg'));

    // refresh video thumbnail
    if (!$form->getSkipThumbnailRender())
      ThumbnailFactory::createThumbnailFromId($form->getVideoID());
  }

  // update videos order in album
  static function updateVideosOrder(VideoOrderType $form)
  {
    $videoCount = count($form->getVideoIDs());

    for ($i = 0; $i < $videoCount; $i++)
      VideoRepository::updateItemPosition($form->getVideoIDs()[$i], $i);
  }

  // delete video
  static function deleteVideo(int $videoID)
  {
    //get video
    $video = VideoRepository::getItem($videoID);

    //check if video exists
    if (!$video)
      throw new UserMessageException(__('Database Error: Video does not exist', 'utvg'));

    //delete video
    if (!VideoRepository::deleteItem($videoID))
      throw new UserMessageException(__('Database Error: Failed to delete video', 'utvg'));

    //delete video thumbnail
    $thumbnailPath = wp_upload_dir();
    $thumbnailPath = $thumbnailPath['basedir'] . '/utubevideo-cache/';
    unlink($thumbnailPath . $video->getThumbnail() . '.jpg');
    unlink($thumbnailPath . $video->getThumbnail() . '@2x.jpg');
  }
}
