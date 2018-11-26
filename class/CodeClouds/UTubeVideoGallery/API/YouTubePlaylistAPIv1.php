<?php

namespace CodeClouds\UTubeVideoGallery\API;

use CodeClouds\UTubeVideoGallery\API\APIv1;
use CodeClouds\UTubeVideoGallery\Shared\Utility;
use WP_REST_Request;
use WP_REST_Server;
use stdClass;
use DateTime;
use DateInterval;
use utvAdminGen;

class YouTubePlaylistAPIv1 extends APIv1
{
  private $_options;

  public function __construct()
  {
    $this->_options = get_option('utubevideo_main_opts');
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }

  public function registerRoutes()
  {
    //get all videos in album endpoint
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'youtubeplaylists/(?P<sourceID>.*)',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getAllItems'],
        'args' => [
          'sourceID'
        ]
      ]
    );
  }

  public function getAllItems(WP_REST_Request $req)
  {
    //initialize return object
    $returnData = new stdClass();
    $returnData->title = '';
    $returnData->videos = [];

    //check for a possibly valid api key before continuing
    if (Utility::isNullOrEmpty($this->_options['youtubeApiKey']))
      return $this->errorResponse('YouTube API key is missing');

    //check for valid sourceID
    if (!$req['sourceID'])
      return $this->errorResponse('Invalid source ID');

    //gather data fields
    $sourceID = sanitize_text_field($req['sourceID']);

    //retrieve playlist title
    $data = Utility::queryAPI(
      'https://www.googleapis.com/youtube/v3/playlists?key='
      . $this->_options['youtubeApiKey']
      . '&part=snippet&id='
      . $sourceID
    );



    if ($data)
    {
      if (isset($data->items[0]->snippet->title))
        $returnData->title = $data->items[0]->snippet->title;
    }






    //get base video data
    $nextPageToken = true;
    $baseVideosData = [];

    while ($nextPageToken)
    {
      $data = Utility::queryAPI(
        'https://www.googleapis.com/youtube/v3/playlistItems?key='
        . $this->_options['youtubeApiKey']
        . '&part=snippet,contentDetails,status&maxResults=50&playlistId='
        . $sourceID
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









    $finalVideoData = [];

    //get final video data to filter with
    foreach ($videoIDSetList as $list)
    {
      $data = Utility::queryAPI(
        'https://www.googleapis.com/youtube/v3/videos?key='
        . $this->_options['youtubeApiKey']
        . '&part=contentDetails,snippet,status&id='
        . implode(',', $list)
      );

      if ($data && isset($data->items))
        $finalVideoData = array_merge($finalVideoData, $data->items);
    }











    //filter videos and add them to return data
    foreach ($finalVideoData as $video)
    {
      if (
        !Utility::hasValue($video->status->uploadStatus, 'rejected')
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
        $videoData = new stdClass();
        $videoData->sourceID = $video->id;
        $videoData->title = $video->snippet->title;
        $videoData->description = $video->snippet->description;
        $videoData->thumbnail = $thumbnailURL;
        $videoData->duration = $duration;

        $returnData->videos[] = $videoData;
      }
    }

    return $this->response($returnData);
  }
}
