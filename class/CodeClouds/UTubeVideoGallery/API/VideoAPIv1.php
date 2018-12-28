<?php

namespace CodeClouds\UTubeVideoGallery\API;

use CodeClouds\UTubeVideoGallery\API\APIv1;
use CodeClouds\UTubeVideoGallery\Service\Thumbnail;
use CodeClouds\UTubeVideoGallery\Repository\VideoRepository;
use WP_REST_Request;
use WP_REST_Server;

class VideoAPIv1 extends APIv1
{
  public function __construct()
  {
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }

  public function registerRoutes()
  {
    //get all videos in album endpoint
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'albums/(?P<albumID>\d+)/videos',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getAllItems'],
        'args' => [
          'galleryID',
          'albumID'
        ]
      ]
    );

    //create new video endpoint
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'videos',
      [
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'createItem'],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getAnyAllItems'],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ]
      ]

    );

    //get, update, delete video endpoints
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'videos/(?P<videoID>\d+)',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getItem'],
          'args' => [
            'videoID'
          ],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => WP_REST_Server::DELETABLE,
          'callback' => [$this, 'deleteItem'],
          'args' => [
            'videoID'
          ],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => 'PATCH',
          'callback' => [$this, 'updateItem'],
          'args' => [
            'videoID'
          ],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ]
      ]
    );
  }

  //get single video
  public function getItem(WP_REST_Request $req)
  {
    //check for valid videoID
    if (!$req['videoID'])
      return $this->errorResponse(__('Invalid video ID', 'utvg'));

    //sanitize data
    $videoID = sanitize_key($req['videoID']);

    //get video
    $videoRepository = new VideoRepository();
    $video = $videoRepository->getItem($videoID);

    //check if video exists
    if (!$video)
      return $this->errorResponse(__('The specified video resource was not found', 'utvg'));

    return $this->response($video);
  }

  //create video
  public function createItem(WP_REST_Request $req)
  {
    //create repository
    $videoRepository = new VideoRepository();

    //gather data fields
    $sourceID = sanitize_text_field($req['sourceID']);
    $title = sanitize_text_field($req['title']);
    $description = sanitize_text_field($req['description']);
    $quality = sanitize_text_field($req['quality']);
    $showControls = ($req['controls'] ? 1 : 0);
    $startTime = sanitize_text_field($req['startTime']);
    $endTime = sanitize_text_field($req['endTime']);
    $source = sanitize_text_field($req['source']);
    $albumID = sanitize_key($req['albumID']);
    $playlistID = sanitize_key($req['playlistID']);

    //check for required fields
    if (
      empty($sourceID)
      || empty($quality)
      || !isset($showControls)
      || empty($source)
      || !isset($albumID)
    )
      return $this->errorResponse(__('Invalid parameters', 'utvg'));

    //get next video sort position
    $nextSortPosition = $videoRepository->getNextSortPositionByAlbum($albumID);

    //check if value exists
    if ($nextSortPosition === false)
      return $this->errorResponse(__('A database error has occured', 'utvg'));

    //get video thumbnail type
    $thumbnailType = $videoRepository->getThumbnailTypeByAlbum($albumID);

    if (!$thumbnailType)
      return $this->errorResponse(__('A database error has occured', 'utvg'));

    //insert new video
    $videoID = $videoRepository->createItem(
      $source,
      $title,
      $description,
      $sourceID,
      $thumbnailType,
      $quality,
      $showControls,
      $startTime,
      $endTime,
      $nextSortPosition,
      $albumID,
      $playlistID
    );

    //if successfull video creation..
    if ($videoID)
    {
      $thumbnail = new Thumbnail($videoID);

      if (!$thumbnail->save())
      {
        //delete video on failure
        if (!$videoRepository->deleteItem($videoID))
          return $this->errorResponse(__('A database error has occurred', 'utvg'));

        //return error message
        return $this->errorResponse(__('Video thumbnail failed to save', 'utvg'));
      }

      return $this->response(null, 201);
    }
    else
      return $this->errorResponse(__('A database error has occurred', 'utvg'));
  }

  //delete video
  public function deleteItem(WP_REST_Request $req)
  {
    //check for valid videoID
    if (!$req['videoID'])
      return $this->errorResponse(__('Invalid video ID', 'utvg'));

    //sanitize data
    $videoID = sanitize_key($req['videoID']);

    //get video
    $videoRepository = new VideoRepository();
    $video = $videoRepository->getItem($videoID);

    //check if video exists
    if (!$video)
      return $this->errorResponse(__('Video does not exist', 'utvg'));

    //delete video
    if (!$videoRepository->deleteItem($videoID))
      return $this->errorResponse(__('A database error has occurred', 'utvg'));

    //delete video thumbnail
    $thumbnailPath = wp_upload_dir();
    $thumbnailPath = $thumbnailPath['basedir'] . '/utubevideo-cache/';
    unlink($thumbnailPath . $video->getThumbnail() . '.jpg');
    unlink($thumbnailPath . $video->getThumbnail() . '@2x.jpg');

    return $this->response(null);
  }

  //update video
  public function updateItem(WP_REST_Request $req)
  {
    //check for valid videoID
    if (!$req['videoID'])
      return $this->errorResponse(__('Invalid video ID', 'utvg'));

    //gather data fields
    $videoID = sanitize_key($req['videoID']);
    $title = sanitize_text_field($req['title']);
    $description = sanitize_text_field($req['description']);
    $quality = sanitize_text_field($req['quality']);
    $startTime = sanitize_text_field($req['startTime']);
    $endTime = sanitize_text_field($req['endTime']);

    if (isset($req['controls']))
      $controls = $req['controls'] ? 1 : 0;
    else
      $controls = null;

    if (isset($req['published']))
      $published = $req['published'] ? 1 : 0;
    else
      $published = null;

    $albumID = sanitize_key($req['albumID']);
    $currentTime = current_time('timestamp');
    $skipThumbnailRender = $req['skipThumbnailRender'] ? true : false;

    //create updatedFields array
    $updatedFields = [];

    //set optional update fields
    if ($title != null)
      $updatedFields['VID_NAME'] = $title;

    if ($description != null)
      $updatedFields['VID_DESCRIPTION'] = $description;

    if ($quality != null)
      $updatedFields['VID_QUALITY'] = $quality;

    if ($controls !== null)
      $updatedFields['VID_CHROME'] = $controls;

    if ($startTime != null)
      $updatedFields['VID_STARTTIME'] = $startTime;

    if ($endTime != null)
      $updatedFields['VID_ENDTIME'] = $endTime;

    if ($published !== null)
      $updatedFields['VID_PUBLISH'] = $published;

    if ($albumID != null)
      $updatedFields['ALB_ID'] = $albumID;

    //set required update fields
    $updatedFields['VID_UPDATEDATE'] = $currentTime;
    $updatedFields['VID_THUMBTYPE'] = 'default';

    //update video
    $videoRepository = new VideoRepository();

    if ($videoRepository->updateItem($videoID, $updatedFields))
    {
      if (!$skipThumbnailRender)
      {
        //resave thumbnail
        $thumbnail = new Thumbnail($videoID);

        if (!$thumbnail->save())
          return $this->errorResponse(__('Video thumbnail refresh failed', 'utvg'));
      }

      return $this->response(null);
    }
    else
      return $this->errorResponse(__('A database error has occurred', 'utvg'));
  }

  //get list of videos within album
  public function getAllItems(WP_REST_Request $req)
  {
    //check for valid videoID
    if (!$req['albumID'])
      return $this->errorResponse(__('Invalid album ID', 'utvg'));

    //sanitize data
    $albumID = sanitize_key($req['albumID']);

    //get videos
    $videoRepository = new VideoRepository();
    $videos = $videoRepository->getItemsByAlbum($albumID);

    return $this->response($videos);
  }

  //get list of all videos
  public function getAnyAllItems(WP_REST_Request $req)
  {
    //get videos
    $videoRepository = new VideoRepository();
    $videos = $videoRepository->getItems();

    return $this->response($videos);
  }
}
