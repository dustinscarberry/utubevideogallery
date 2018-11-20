<?php

namespace CodeClouds\UTubeVideoGallery\API;

use CodeClouds\UTubeVideoGallery\API\APIv1;
use WP_REST_Request;
use WP_REST_Server;
use stdClass;

class PlaylistAPIv1 extends APIv1
{
  public function __construct()
  {
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }

  public function registerRoutes()
  {
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      '/playlists',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getAllItems']
        ],
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'createItem'],
          'permission_callback' => function()
          {
            return current_user_can('edit_others_posts');
          }
        ]
      ]
    );

    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'playlists/(?P<playlistID>\d+)',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getItem'],
          'args' => [
            'playlistID'
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
            'playlistID'
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
            'playlistID'
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

    //check for valid playlistID
    if (!$req['playlistID'])
      return $this->errorResponse('Invalid playlist ID');

    //gather data fields
    $playlistID = sanitize_key($req['playlistID']);

    //fetch playlist data
    $playlist = $wpdb->get_results(
      'SELECT p.*, ALB_NAME
      FROM ' . $wpdb->prefix . 'utubevideo_playlist p
      INNER JOIN ' . $wpdb->prefix . 'utubevideo_album a ON p.ALB_ID = a.ALB_ID
      WHERE PLAY_ID = ' . $playlistID
    );

    //check for valid playlist data
    if (!$playlist)
      return $this->errorResponse('The specified video resource was not found');

    $playlist = $playlist[0];

    //map json
    $playlistData = new stdClass();

    $playlistData->id = $playlist->PLAY_ID;
    $playlistData->title = $playlist->PLAY_TITLE;
    $playlistData->source = $playlist->PLAY_SOURCE;
    $playlistData->sourceID = $playlist->PLAY_SOURCEID;
    $playlistData->videoQuality = $playlist->PLAY_QUALITY;
    $playlistData->showControls = $playlist->PLAY_CHROME ? true : false;
    $playlistData->updateDate = $playlist->PLAY_UPDATEDATE;
    $playlistData->albumID = $playlist->ALB_ID;
    $playlistData->albumName = $playlist->ALB_NAME;

    return $this->response($playlistData);
  }

  public function createItem(WP_REST_Request $req)
  {
    global $wpdb;

    //gather data fields
    $title = sanitize_text_field($req['title']);
    $source = sanitize_text_field($req['source']);
    $sourceID = sanitize_text_field($req['sourceID']);
    $videoQuality = sanitize_text_field($req['videoQuality']);
    $showControls = $req['showControls'] ? 0 : 1;
    $albumID = sanitize_key($req['albumID']);
    $time = current_time('timestamp');

    //check for required fields
    if (empty($title)
      || empty($source)
      || empty($sourceID)
      || empty($videoQuality)
      || empty($albumID)
    )
      return $this->errorResponse('Invalid parameters');

    //insert new playlist
    if ($wpdb->insert(
      $wpdb->prefix . 'utubevideo_playlist',
      [
        'PLAY_TITLE' => $title,
        'PLAY_SOURCE' => $source,
        'PLAY_SOURCEID' => $sourceID,
        'PLAY_QUALITY' => $videoQuality,
        'PLAY_CHROME' => $showControls,
        'PLAY_UPDATEDATE' => $time,
        'ALB_ID' => $albumID
      ]
    ))
      return $this->response(null, 201);
    else
      return $this->errorResponse('A database error has occurred');
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

    global $wpdb;
    $playlists = $wpdb->get_results('SELECT p.*, ALB_NAME
      FROM ' . $wpdb->prefix . 'utubevideo_playlist p
      INNER JOIN ' . $wpdb->prefix . 'utubevideo_album a ON p.ALB_ID = a.ALB_ID
      ORDER BY PLAY_ID'
    );

    foreach ($playlists as $playlist)
    {
      $playlistData = new stdClass();
      $playlistData->id = $playlist->PLAY_ID;
      $playlistData->title = $playlist->PLAY_TITLE;
      $playlistData->source = $playlist->PLAY_SOURCE;
      $playlistData->sourceID = $playlist->PLAY_SOURCEID;
      $playlistData->videoQuality = $playlist->PLAY_QUALITY;
      $playlistData->showControls = $playlist->PLAY_CHROME ? true : false;
      $playlistData->updateDate = $playlist->PLAY_UPDATEDATE;
      $playlistData->albumID = $playlist->ALB_ID;
      $playlistData->albumName = $playlist->ALB_NAME;

      $data[] = $playlistData;
    }

    return $this->response($data);
  }
}
