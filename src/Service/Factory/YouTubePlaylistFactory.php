<?php

namespace Dscarberry\UTubeVideoGallery\Service\Factory;

use Dscarberry\UTubeVideoGallery\Service\Utility;
use Dscarberry\UTubeVideoGallery\Model\Settings;
use Dscarberry\UTubeVideoGallery\Form\YouTubePlaylistType;
use Dscarberry\UTubeVideoGallery\Exception\UserMessageException;
use DateTime;
use DateInterval;

class YouTubePlaylistFactory
{
  static function getPlaylistData(YouTubePlaylistType $form)
  {
    //get settings
    $settings = new Settings();

    //initialize return object
    $playlistData = new \stdClass();
    $playlistData->title = '';
    $playlistData->videos = [];

    //check for an api key
    if (Utility::isNullOrEmpty($settings->getYouTubeApiKey()))
      throw new UserMessageException(__('YouTube API key is missing', 'utvg'));

    //retrieve playlist title
    $data = Utility::queryAPI(
      'https://www.googleapis.com/youtube/v3/playlists?key='
      . $settings->getYouTubeApiKey()
      . '&part=snippet&id='
      . $form->getSourceID()
    );

    if ($data && isset($data->items[0]->snippet->title))
      $playlistData->title = $data->items[0]->snippet->title;

    //get base video data
    $nextPageToken = true;
    $baseVideosData = [];

    while ($nextPageToken)
    {
      $data = Utility::queryAPI(
        'https://www.googleapis.com/youtube/v3/playlistItems?key='
        . $settings->getYouTubeApiKey()
        . '&part=snippet,contentDetails,status&maxResults=50&playlistId='
        . $form->getSourceID()
        . (strlen($nextPageToken) > 1 ? '&pageToken=' . $nextPageToken : '')
      );

      if ($data)
      {
        if (isset($data->items))
          $baseVideosData = array_merge($baseVideosData, $data->items);

        if (isset($data->nextPageToken))
          $nextPageToken = $data->nextPageToken;
        else
          $nextPageToken = false;
      }
    }

    //create search id string to query video details for filtering info
    $videoIDsList = [];
    $videoIDSetList = [];

    foreach ($baseVideosData as $video)
    {
      if (isset($video->snippet->resourceId->videoId))
        $videoIDsList[] = $video->snippet->resourceId->videoId;

      if (count($videoIDsList) == 50)
      {
        $videoIDSetList[] = $videoIDsList;
        $videoIDsList = [];
      }
    }

    if (count($videoIDsList) > 0)
      $videoIDSetList[] = $videoIDsList;

    //get final video data to filter with
    $finalVideoData = [];

    foreach ($videoIDSetList as $list)
    {
      $data = Utility::queryAPI(
        'https://www.googleapis.com/youtube/v3/videos?key='
        . $settings->getYouTubeApiKey()
        . '&part=contentDetails,snippet,status&id='
        . implode(',', $list)
      );

      if ($data && isset($data->items))
        $finalVideoData = array_merge($finalVideoData, $data->items);
    }

    //filter videos and add them to playlist data
    foreach ($finalVideoData as $video)
    {
      if (!Utility::hasValue($video->status->uploadStatus, 'rejected')
        && Utility::hasValue($video->status->embeddable, true)
        && Utility::hasValue($video->status->privacyStatus, 'public')
      )
      {
        //convert duration
        $duration = new DateTime('@0');
        $duration->add(new DateInterval($video->contentDetails->duration));
        $duration = $duration->format('H:i:s');

        //get best thumbnail
        $thumbnailSources = $video->snippet->thumbnails;
        end($thumbnailSources);
        $thumbnailKey = key($thumbnailSources);
        $thumbnailURL = $thumbnailSources->{$thumbnailKey}->url;

        //map video
        $videoData = new \stdClass();
        $videoData->sourceID = $video->id;
        $videoData->title = $video->snippet->title;
        $videoData->description = $video->snippet->description;
        $videoData->thumbnail = $thumbnailURL;
        $videoData->duration = $duration;

        $playlistData->videos[] = $videoData;
      }
    }

    return $playlistData;
  }
}
