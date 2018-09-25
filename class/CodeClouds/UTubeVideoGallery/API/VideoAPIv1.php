<?php

namespace CodeClouds\UTubeVideoGallery\API;

use WP_REST_Request;
use WP_REST_Server;
use stdClass;
use utvAdminGen;

class VideoAPIv1
{
  private $_namespace = 'utubevideogallery';
  private $_version = 'v1';

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
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => [$this, 'createItem'],
        'permission_callback' => function() {
          return current_user_can('edit_others_posts');
        }
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
          'permission_callback' => function() {
            return true;
            //return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => WP_REST_Server::DELETABLE,
          'callback' => [$this, 'deleteItem'],
          'args' => [
            'videoID'
          ],
          'permission_callback' => function() {
            return true;
            //return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => 'PATCH',
          'callback' => [$this, 'updateItem'],
          'args' => [
            'videoID'
          ],
          'permission_callback' => function() {
            return true;
            //return current_user_can('edit_others_posts');
          }
        ]
      ]
    );
  }

  public function getItem(WP_REST_Request $req)
  {
    $videoData = new stdClass();
    $thumbnailDirectory = wp_upload_dir()['baseurl'];

    global $wpdb;
    $video = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_video WHERE VID_ID = ' . $req['videoID']);

    if (!$video)
      return null;

    $video = $video[0];
    $videoData->id = $video->VID_ID;
    $videoData->title = $video->VID_NAME;
    $videoData->source = $video->VID_SOURCE;
    $videoData->thumbnail = $thumbnailDirectory . '/utubevideo-cache/' . $video->VID_URL . $video->VID_ID . '.jpg';
    $videoData->url = $video->VID_URL;
    $videoData->quality = $video->VID_QUALITY;
    $videoData->showChrome = $video->VID_CHROME;
    $videoData->startTime = $video->VID_STARTTIME;
    $videoData->endTime = $video->VID_ENDTIME;
    $videoData->position = $video->VID_POS;
    $videoData->published = $video->VID_PUBLISH;
    $videoData->updateDate = $video->VID_UPDATEDATE;
    $videoData->albumID = $video->ALB_ID;

    return $videoData;
  }

  public function createItem(WP_REST_Request $req)
  {



    //require helper classes
    require_once(dirname(__FILE__) . '/../../../utvAdminGen.php');
    utvAdminGen::initialize([]);

    global $wpdb;



    $urlKey = sanitize_text_field($req->get_param('urlKey'));
    $title = sanitize_text_field($req->get_param('title'));
    $quality = sanitize_text_field($req->get_param('quality'));
    $controls = ($req->get_param('controls') ? 0 : 1);
    $startTime = sanitize_text_field($req->get_param('startTime'));
    $endTime = sanitize_text_field($req->get_param('endTime'));

    $source = sanitize_text_field($req->get_param('source'));
    $albumID = sanitize_key($req->get_param('albumID'));

    $time = current_time('timestamp');


    if (empty($urlKey) || empty($quality) || !isset($controls) || empty($source) || !isset($albumID))
      return 'Bad parameters';



    //get current video count for album//
    $videoCount = $wpdb->get_results('SELECT COUNT(VID_ID) AS VID_COUNT FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $albumID)[0];
    $gallery = $wpdb->get_results('SELECT DATA_THUMBTYPE FROM ' . $wpdb->prefix . 'utubevideo_album a INNER JOIN ' . $wpdb->prefix . 'utubevideo_dataset d ON a.DATA_ID = d.DATA_ID WHERE a.ALB_ID = ' . $albumID)[0];

    $nextSortPos = $videoCount->VID_COUNT;


    if ($source == 'youtube')
      $sourceThumbnail = 'http://img.youtube.com/vi/' . $urlKey . '/0.jpg';
    elseif ($source == 'vimeo')
    {



      $data = utvAdminGen::queryAPI('https://vimeo.com/api/v2/video/' . $urlKey . '.json');
      $sourceThumbnail = $data[0]['thumbnail_large'];
    }


    //insert new video
    if ($wpdb->insert(
      $wpdb->prefix . 'utubevideo_video',
      [
        'VID_SOURCE' => $source,
        'VID_NAME' => $title,
        'VID_URL' => $urlKey,
        'VID_THUMBTYPE' => $gallery->DATA_THUMBTYPE,
        'VID_QUALITY' => $quality,
        'VID_CHROME' => $controls,
        'VID_STARTTIME' => $startTime,
        'VID_ENDTIME' => $endTime,
        'VID_POS' => $nextSortPos,
        'VID_UPDATEDATE' => $time,
        'ALB_ID' => $albumID
      ]
    ))
    {
      //get last insert id and save thumbnail
      $videoID = $wpdb->insert_id;

      if (!utvAdminGen::saveThumbnail($sourceThumbnail, $urlKey . $videoID, $gallery->DATA_THUMBTYPE))
      {
        $wpdb->query('DELETE FROM ' . $wpdb->prefix . 'utubevideo_video WHERE VID_ID ="' . $videoID . '"');
        return 'Video thumbnail failed to save correctly.';
      }

      return 'Video added to album.';
    }
    else
      return 'Something went wrong. Please try again.';


      return 'hi';






  }

  public function deleteItem(WP_REST_Request $req)
  {

  }

  public function updateItem(WP_REST_Request $req)
  {

  }

  public function getAllItems(WP_REST_Request $req)
  {
    $data = [];
    $thumbnailDirectory = wp_upload_dir()['baseurl'];
    global $wpdb;

    $videos = $wpdb->get_results('SELECT * FROM ' . $wpdb->prefix . 'utubevideo_video WHERE ALB_ID = ' . $req['albumID'] . ' ORDER BY VID_POS');

    if (!$videos)
      return null;

    foreach ($videos as $video)
    {
      $videoData = new stdClass();
      $videoData->id = $video->VID_ID;
      $videoData->title = $video->VID_NAME;
      $videoData->source = $video->VID_SOURCE;
      $videoData->thumbnail = $thumbnailDirectory . '/utubevideo-cache/' . $video->VID_URL . $video->VID_ID . '.jpg';
      $videoData->url = $video->VID_URL;
      $videoData->quality = $video->VID_QUALITY;
      $videoData->showChrome = $video->VID_CHROME;
      $videoData->startTime = $video->VID_STARTTIME;
      $videoData->endTime = $video->VID_ENDTIME;
      $videoData->position = $video->VID_POS;
      $videoData->published = $video->VID_PUBLISH;
      $videoData->updateDate = $video->VID_UPDATEDATE;
      $videoData->albumID = $video->ALB_ID;

      $data[] = $videoData;
    }

    return $data;
  }
}
