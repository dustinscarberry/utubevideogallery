<?php

namespace CodeClouds\UTubeVideoGallery\API;

use WP_REST_Request;
use WP_REST_Server;

class ShortcodeAPI
{
  private $_namespace = 'utubevideogallery';
  private $_version = 'v1';

  public function registerRoutes()
  {
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'shortcodes/(?P<id>\d+)',
      [
        'methods' => WP_REST_Server::READABLE,
        'callback' => [$this, 'getShortcodeData'],
        'args' => [
          'id'
        ]
      ]
    );
  }

  public function getShortcodeData(WP_REST_Request $req)
  {



    global $wpdb;

    //get gallery basic data
    $gallery = $wpdb->get_results('SELECT DATA_SORT, DATA_DISPLAYTYPE FROM ' . $wpdb->prefix . 'utubevideo_dataset WHERE DATA_ID = "' . $this->_atts['id'] . '"', ARRAY_A)[0];

    //set thumbnail cache folder location
    $dir = wp_upload_dir()['baseurl'];



    //check for valid album id if provided
    $albumId = sanitize_text_field($albumId);

    if ($type == 'permalink' && $albumId != null)
    {
      $meta = $wpdb->get_results('SELECT ALB_ID, DATA_ID FROM ' . $wpdb->prefix . 'utubevideo_album WHERE ALB_SLUG = "' . $albumId . '"', ARRAY_A)[0];

      if ($meta)
      {
        $this->_aid = $meta['ALB_ID'];

        if ($meta['DATA_ID'] == $this->_atts['id'] && $this->_gallery['DATA_DISPLAYTYPE'] == 'album')
          $this->_validAlbum = true;
      }
    }
    elseif($type == 'query' && $albumId != null)
    {
      $args = explode('-', $albumId);

      //if valid aid token
      if (count($args) == 2)
      {
        $this->_aid = $args[0];
        $check = $args[1];

        if ($check == $this->_atts['id'] && $this->_gallery['DATA_DISPLAYTYPE'] == 'album')
          $this->_validAlbum = true;
      }
    }
  }













    //just sample data
    return [
      'name' => [
        'first' => 'Mr',
        'last' => 'Sir'
      ],
      'id' => $req['id']
    ];
  }

  public function hookAPI()
  {
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }
}
