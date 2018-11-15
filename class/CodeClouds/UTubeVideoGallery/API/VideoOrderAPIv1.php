<?php

namespace CodeClouds\UTubeVideoGallery\API;

use CodeClouds\UTubeVideoGallery\API\APIv1;
use WP_REST_Request;
use WP_REST_Server;

class VideoOrderAPIv1 extends APIv1
{
  public function __construct()
  {
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }

  public function registerRoutes()
  {
    //get, update, delete video endpoints
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'videosorder',
      [
        'methods' => 'PATCH',
        'callback' => [$this, 'updateItem'],
        'permission_callback' => function()
        {
          return current_user_can('edit_others_posts');
        }
      ]
    );
  }

  public function updateItem(WP_REST_Request $req)
  {
    global $wpdb;

    if (!$req['videoids'])
      return $this->errorResponse('Invalid data');

    $videoCount = count($req['videoids']);

    for ($i = 0; $i < $videoCount; $i++)
    {
      $videoID = sanitize_key($req['videoids'][$i]);

      if (!$videoID)
        return $this->errorResponse('Invalid data value');

      $wpdb->update(
        $wpdb->prefix . 'utubevideo_video',
        ['VID_POS' => $i],
        ['VID_ID' => $videoID]
      );
    }

    return $this->response(null);
  }
}
