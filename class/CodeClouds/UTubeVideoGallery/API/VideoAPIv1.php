<?php

namespace CodeClouds\UTubeVideoGallery\API;

use CodeClouds\UTubeVideoGallery\API\APIv1;
use CodeClouds\UTubeVideoGallery\Shared\Thumbnail;
use WP_REST_Request;
use WP_REST_Server;
use stdClass;
use utvAdminGen;

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

  public function getItem(WP_REST_Request $req)
  {
    global $wpdb;

    //check for valid videoID
    if (!$req['videoID'])
      return $this->errorResponse('Invalid video ID');

    //gather data fields
    $videoID = sanitize_key($req['videoID']);

    $video = $wpdb->get_results(
      'SELECT *
      FROM ' . $wpdb->prefix . 'utubevideo_video
      WHERE VID_ID = ' . $videoID
    );

    //check if video exists
    if (!$video)
      return $this->errorResponse('The specified video resource was not found');

    $video = $video[0];

    $videoData = new stdClass();
    $videoData->id = $video->VID_ID;
    $videoData->title = $video->VID_NAME;
    $videoData->description = $video->VID_DESCRIPTION;
    $videoData->source = $video->VID_SOURCE;
    $videoData->thumbnail = $video->VID_URL . $video->VID_ID;
    $videoData->sourceID = $video->VID_URL;
    $videoData->quality = $video->VID_QUALITY;
    $videoData->showChrome = $video->VID_CHROME;
    $videoData->startTime = $video->VID_STARTTIME;
    $videoData->endTime = $video->VID_ENDTIME;
    $videoData->position = $video->VID_POS;
    $videoData->published = $video->VID_PUBLISH;
    $videoData->updateDate = $video->VID_UPDATEDATE;
    $videoData->albumID = $video->ALB_ID;
    $videoData->playlistData = $video->PLAY_ID;

    return $this->response($videoData);
  }

  public function createItem(WP_REST_Request $req)
  {
    global $wpdb;

    //gather data fields
    $sourceID = sanitize_text_field($req['sourceID']);
    $title = sanitize_text_field($req['title']);
    $description = sanitize_text_field($req['description']);
    $quality = sanitize_text_field($req['quality']);
    $controls = ($req['controls'] ? 1 : 0);
    $startTime = sanitize_text_field($req['startTime']);
    $endTime = sanitize_text_field($req['endTime']);
    $source = sanitize_text_field($req['source']);
    $albumID = sanitize_key($req['albumID']);
    $playlistID = sanitize_key($req['playlistID']);
    $time = current_time('timestamp');

    //check for required fields
    if (
      empty($sourceID)
      || empty($quality)
      || !isset($controls)
      || empty($source)
      || !isset($albumID)
    )
      return $this->errorResponse('Invalid parameters');

    //get current video count for album
    $videoCount = $wpdb->get_results(
      'SELECT COUNT(VID_ID) AS VID_COUNT
      FROM ' . $wpdb->prefix . 'utubevideo_video
      WHERE ALB_ID = ' . $albumID
    );

    //check if value exists
    if (!$videoCount)
      return $this->errorResponse('A database error has occured during lookup');

    $videoCount = $videoCount[0];

    $gallery = $wpdb->get_results(
      'SELECT DATA_THUMBTYPE
      FROM ' . $wpdb->prefix . 'utubevideo_album a
      INNER JOIN ' . $wpdb->prefix . 'utubevideo_dataset d ON a.DATA_ID = d.DATA_ID
      WHERE a.ALB_ID = ' . $albumID
    );

    if (!$gallery)
      return $this->errorResponse('A database error has occured during lookup');

    $gallery = $gallery[0];

    $nextSortPos = $videoCount->VID_COUNT;

    //insert new video
    if ($wpdb->insert(
      $wpdb->prefix . 'utubevideo_video',
      [
        'VID_SOURCE' => $source,
        'VID_NAME' => $title,
        'VID_DESCRIPTION' => $description,
        'VID_URL' => $urlKey,
        'VID_THUMBTYPE' => $gallery->DATA_THUMBTYPE,
        'VID_QUALITY' => $quality,
        'VID_CHROME' => $controls,
        'VID_STARTTIME' => $startTime,
        'VID_ENDTIME' => $endTime,
        'VID_POS' => $nextSortPos,
        'VID_UPDATEDATE' => $time,
        'ALB_ID' => $albumID,
        'PLAY_ID' => $playlistID
      ]
    ))
    {
      //get last insert id and save thumbnail
      $videoID = $wpdb->insert_id;

      $thumbnail = new Thumbnail($videoID);

      if (!$thumbnail->save())
      {
        //delete video from database
        if (!$wpdb->delete(
          $wpdb->prefix . 'utubevideo_video',
          ['VID_ID' => $videoID]
        ))
          return $this->errorResponse('A database error has occurred');

        //return error message
        return $this->errorResponse('Video thumbnail failed to save');
      }

      return $this->response(null, 201);
    }
    else
      return $this->errorResponse('A database error has occurred');
  }

  public function deleteItem(WP_REST_Request $req)
  {
    global $wpdb;

    //check for valid videoID
    if (!$req['videoID'])
      return $this->errorResponse('Invalid video ID');

    //sanitize data
    $videoID = sanitize_key($req['videoID']);

    //get all videos in album
    $video = $wpdb->get_results(
      'SELECT VID_ID, VID_URL
      FROM ' . $wpdb->prefix . 'utubevideo_video
      WHERE VID_ID = ' . $videoID
    );

    //check if video exists
    if (!$video)
      return $this->errorResponse('Video does not exist');

    $video = $video[0];

    //update database entry
    if (!$wpdb->delete(
      $wpdb->prefix . 'utubevideo_video',
      ['VID_ID' => $videoID]
    ))
      return $this->errorResponse('A database error has occurred');

    //delete video thumbnail
    $thumbnailPath = (wp_upload_dir())['basedir'] . '/utubevideo-cache/';
    unlink($thumbnailPath . $video->VID_URL . $video->VID_ID . '.jpg');

    return $this->response(null);
  }

  public function updateItem(WP_REST_Request $req)
  {
    global $wpdb;

    //check for valid videoID
    if (!$req['videoID'])
      return $this->errorResponse('Invalid video ID');

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

    //update database entry
    if ($wpdb->update(
      $wpdb->prefix . 'utubevideo_video',
      $updatedFields,
      ['VID_ID' => $videoID]
    ) >= 0)
    {
      if (!$skipThumbnailRender)
      {
        $thumbnail = new Thumbnail($videoID);

        if (!$thumbnail->save())
          return $this->errorResponse('Video thumbnail refresh failed');
      }

      return $this->response(null);
    }
    else
      return $this->errorResponse('A database error has occurred');
  }

  public function getAllItems(WP_REST_Request $req)
  {
    $data = [];
    global $wpdb;

    $videos = $wpdb->get_results(
      'SELECT *
      FROM ' . $wpdb->prefix . 'utubevideo_video
      WHERE ALB_ID = ' . $req['albumID']
      . ' ORDER BY VID_POS'
    );

    foreach ($videos as $video)
    {
      $videoData = new stdClass();
      $videoData->id = $video->VID_ID;
      $videoData->title = $video->VID_NAME;
      $videoData->description = $video->VID_DESCRIPTION;
      $videoData->source = $video->VID_SOURCE;
      $videoData->thumbnail = $video->VID_URL . $video->VID_ID;
      $videoData->sourceID = $video->VID_URL;
      $videoData->quality = $video->VID_QUALITY;
      $videoData->showChrome = $video->VID_CHROME;
      $videoData->startTime = $video->VID_STARTTIME;
      $videoData->endTime = $video->VID_ENDTIME;
      $videoData->position = $video->VID_POS;
      $videoData->published = $video->VID_PUBLISH;
      $videoData->updateDate = $video->VID_UPDATEDATE;
      $videoData->albumID = $video->ALB_ID;
      $videoData->playlistID = $video->PLAY_ID;

      $data[] = $videoData;
    }

    return $this->response($data);
  }

  public function getAnyAllItems(WP_REST_Request $req)
  {
    $data = [];
    global $wpdb;

    $videos = $wpdb->get_results(
      'SELECT *
      FROM ' . $wpdb->prefix . 'utubevideo_video
      ORDER BY VID_ID'
    );

    foreach ($videos as $video)
    {
      $videoData = new stdClass();
      $videoData->id = $video->VID_ID;
      $videoData->title = $video->VID_NAME;
      $videoData->description = $video->VID_DESCRIPTION;
      $videoData->source = $video->VID_SOURCE;
      $videoData->thumbnail = $video->VID_URL . $video->VID_ID;
      $videoData->sourceID = $video->VID_URL;
      $videoData->quality = $video->VID_QUALITY;
      $videoData->showChrome = $video->VID_CHROME;
      $videoData->startTime = $video->VID_STARTTIME;
      $videoData->endTime = $video->VID_ENDTIME;
      $videoData->position = $video->VID_POS;
      $videoData->published = $video->VID_PUBLISH;
      $videoData->updateDate = $video->VID_UPDATEDATE;
      $videoData->albumID = $video->ALB_ID;
      $videoData->playlistID = $video->PLAY_ID;

      $data[] = $videoData;
    }

    return $this->response($data);
  }
}
