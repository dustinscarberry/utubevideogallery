<?php

namespace Dscarberry\UTubeVideoGallery\Service\Factory;

use Dscarberry\UTubeVideoGallery\Service\Utility;
use Dscarberry\UTubeVideoGallery\Form\VimeoPlaylistType;
use Dscarberry\UTubeVideoGallery\Exception\UserMessageException;

class VimeoPlaylistFactory
{
  static function getPlaylistData(VimeoPlaylistType $form)
  {
    //initialize return object
    $playlistData = new \stdClass();
    $playlistData->title = '';
    $playlistData->videos = [];

    //retrieve playlist base data
    $data = Utility::queryAPI(
      'https://vimeo.com/api/v2/album/'
      . $form->getSourceID()
      . '/info.json'
    );

    //check data fetch
    if (!$data)
      throw new UserMessageException(__('Vimeo API call failed', 'utvg'));

    //retrieve playlist title
    if (isset($data->title))
      $playlistData->title = $data->title;

    //retrieve playlist total videos
    $pages = ceil($data->total_videos / 20);

    //get base videos data
    $baseVideoData = [];

    for ($i = 1; $i <= $pages; $i++)
    {
      $videoData = Utility::queryAPI(
        'https://vimeo.com/api/v2/album/'
        . $form->getSourceID()
        . '/videos.json?page='
        . $i
      );

      if (!$videoData)
        throw new UserMessageException(__('Vimeo API call failed', 'utvg'));

      $baseVideoData = array_merge($baseVideoData, $videoData);
    }

    //filter videos and add them to return data
    foreach ($baseVideoData as $video)
    {
      $duration = gmdate('H:i:s', $video->duration);

      //map video
      $videoData = new \stdClass();
      $videoData->sourceID = $video->id;
      $videoData->title = $video->title;
      $videoData->description = '';
      $videoData->thumbnail = $video->thumbnail_large;
      $videoData->duration = $duration;

      $playlistData->videos[] = $videoData;
    }

    return $playlistData;
  }
}
