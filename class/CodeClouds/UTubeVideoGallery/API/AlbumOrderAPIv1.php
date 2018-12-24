<?php

namespace CodeClouds\UTubeVideoGallery\API;

use CodeClouds\UTubeVideoGallery\API\APIv1;
use WP_REST_Request;
use WP_REST_Server;

class AlbumOrderAPIv1 extends APIv1
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
      'albumsorder',
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

    if (!$req['albumids'])
      return $this->errorResponse(__('Invalid data', 'utvg'));

    $albumCount = count($req['albumids']);

    for ($i = 0; $i < $albumCount; $i++)
    {
      $albumID = sanitize_key($req['albumids'][$i]);

      if (!$albumID)
        return $this->errorResponse(__('Invalid data value', 'utvg'));

      $wpdb->update(
        $wpdb->prefix . 'utubevideo_album',
        ['ALB_POS' => $i],
        ['ALB_ID' => $albumID]
      );
    }

    return $this->response(null);
  }
}
