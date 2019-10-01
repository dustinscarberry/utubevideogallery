<?php

namespace UTubeVideoGallery\Controller\API;

use UTubeVideoGallery\Controller\API\APIv1;
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
    try
    {
      global $wpdb;

      if (!$req['videoids'])
        return $this->respondWithError(__('Invalid data', 'utvg'));

      $videoCount = count($req['videoids']);

      for ($i = 0; $i < $videoCount; $i++)
      {
        $videoID = sanitize_key($req['videoids'][$i]);

        if (!$videoID)
          return $this->respondWithError(__('Invalid data value', 'utvg'));

        $wpdb->update(
          $wpdb->prefix . 'utubevideo_video',
          ['VID_POS' => $i],
          ['VID_ID' => $videoID]
        );
      }

      return $this->respond(null);
    }
    catch (\Exception $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }
}
