<?php

namespace CodeClouds\UTubeVideoGallery\Service\Manager;

use CodeClouds\UTubeVideoGallery\Repository\PlaylistRepository;
use CodeClouds\UTubeVideoGallery\Repository\VideoRepository;
use CodeClouds\UTubeVideoGallery\Form\PlaylistType;
use CodeClouds\UTubeVideoGallery\Exception\UserMessageException;

class PlaylistManager
{
  static function getPlaylist(int $playlistID)
  {
    //get playlist
    $playlist = PlaylistRepository::getItem($playlistID);

    //check if playlist exists
    if (!$playlist)
      throw new UserMessageException(__('The specified playlist was not found', 'utvg'));

    return $playlist;
  }

  static function getPlaylists()
  {
    return PlaylistRepository::getItems();
  }

  static function createPlaylist(PlaylistType $form)
  {
    //create playlist
    $playlistID = PlaylistRepository::createItem(
      $form->getTitle(),
      $form->getSource(),
      $form->getSourceID(),
      $form->getVideoQuality(),
      $form->getShowControls(),
      $form->getAlbumID()
    );

    //if error creating playlist
    if (!$playlistID)
      throw new UserMessageException(__('Database Error: Playlist creation failed', 'utvg'));

    return $playlistID;
  }

  static function updatePlaylist(PlaylistType $form)
  {
    if (!PlaylistRepository::updateItem($form))
      throw new UserMessageException(__('A database error has occurred', 'utvg'));
  }

  static function deletePlaylist(int $playlistID)
  {
    //get playlist
    $playlist = PlaylistRepository::getItem($playlistID);

    //check if playlist exists
    if (!$playlist)
      throw new UserMessageException(__('Playlist does not exist', 'utvg'));

    //get playlist videos
    $playlistVideos = VideoRepository::getItemsByPlaylist($playlistID);

    //delete videos
    foreach ($playlistVideos as $video)
    {
      //delete video
      if (!VideoRepository::deleteItem($video->getID()))
        throw new UserMessageException(__('A database error has occurred', 'utvg'));

      //delete video thumbnail
      $thumbnailPath = wp_upload_dir();
      $thumbnailPath = $thumbnailPath['basedir'] . '/utubevideo-cache/';
      unlink($thumbnailPath . $video->getThumbnail() . '.jpg');
      unlink($thumbnailPath . $video->getThumbnail() . '@2x.jpg');
    }

    //delete playlist
    if (!PlaylistRepository::deleteItem($playlistID))
      throw new UserMessageException(__('A database error has occurred', 'utvg'));
  }
}
