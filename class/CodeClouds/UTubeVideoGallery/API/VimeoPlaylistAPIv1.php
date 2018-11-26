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

class VimeoPlaylistAPIv1 extends APIv1
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
      'vimeoplaylists/(?P<sourceID>.*)',
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

    //check for valid sourceID
    if (!$req['sourceID'])
      return $this->errorResponse('Invalid source ID');

    //gather data fields
    $sourceID = sanitize_text_field($req['sourceID']);

    //retrieve playlist base data
    $data = Utility::queryAPI(
      'https://vimeo.com/api/v2/album/'
      . $sourceID
      . '/info.json'
    );

    //check data fetch
    if (!$data)
      return $this->errorResponse('Vimeo API call failed');

    //retrieve playlist title
    if (isset($data->title))
      $returnData->title = $data->title;

    //retreive playlist total videos
    if ($data->total_videos >= 60)
      $pages = 3;
    else
      $pages = ceil($data->total_videos / 20);

    //get base videos data
    $baseVideoData = [];

    for ($i = 1; $i <= $pages; $i++)
    {
      $videoData = Utility::queryAPI(
        'https://vimeo.com/api/v2/album/'
        . $sourceID
        . '/videos.json?page='
        . $i
      );

      if (!$videoData)
        return $this->errorResponse('Vimeo API call failed');

      $baseVideoData = array_merge($baseVideoData, $videoData);
    }

    //filter videos and add them to return data
    foreach ($baseVideoData as $video)
    {
      $duration = gmdate('H:i:s', $video->duration);

      //map video
      $videoData = new stdClass();
      $videoData->sourceID = $video->id;
      $videoData->title = $video->title;
      $videoData->description = '';
      $videoData->thumbnail = $video->thumbnail_large;
      $videoData->duration = $duration;

      $returnData->videos[] = $videoData;
    }

    return $this->response($returnData);
  }
}
