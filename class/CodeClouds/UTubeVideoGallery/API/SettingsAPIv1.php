<?php

namespace CodeClouds\UTubeVideoGallery\API;

use CodeClouds\UTubeVideoGallery\API\APIv1;
use WP_REST_Request;
use WP_REST_Server;
use stdClass;

class SettingsAPIv1 extends APIv1
{
  public function __construct()
  {
    add_action('rest_api_init', [$this, 'registerRoutes']);
  }

  public function registerRoutes()
  {
    //get, update settings endpoints
    register_rest_route(
      $this->_namespace . '/' . $this->_version,
      'settings',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'getItem'],
          'permission_callback' => function()
          {
            return true;
            return current_user_can('edit_others_posts');
          }
        ],
        [
          'methods' => 'PATCH',
          'callback' => [$this, 'updateItem'],
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
    $options = get_option('utubevideo_main_opts');

    $settingData = new stdClass();
    $settingData->version = $options['version'];
    $settingData->popupPlayerHeight = $options['playerHeight'];
    $settingData->popupPlayerWidth = $options['playerWidth'];
    $settingData->playerControlsTheme = $options['playerControlTheme'];
    $settingData->playerControlsColor = $options['playerProgressColor'];
    $settingData->popupPlayerOverlayOpacity = $options['fancyboxOverlayOpacity'];
    $settingData->popupPlayerOverlayColor = $options['fancyboxOverlayColor'];
    $settingData->thumbnailWidth = $options['thumbnailWidth'];
    $settingData->thumbnailHeight = $options['thumbnailHeight'];
    $settingData->thumbnailWidth = $options['thumbnailWidth'];
    $settingData->thumbnailVerticalPadding = $options['thumbnailVerticalPadding'];
    $settingData->thumbnailHorizontalPadding = $options['thumbnailHorizontalPadding'];
    $settingData->thumbnailBorderRadius = $options['thumbnailBorderRadius'];
    $settingData->youtubeAPIKey = $options['youtubeApiKey'];
    $settingData->youtubeAutoplay = $options['youtubeAutoplay'] ? true : false;
    $settingData->youtubeHideDetails = $options['youtubeDetailsHide'] ? true : false;
    $settingData->vimeoAutoplay = $options['vimeoAutoplay'] ? true : false;
    $settingData->vimeoHideDetails = $options['vimeoDetailsHide'] ? true : false;
    $settingData->removeVideoPopupScript = $options['skipMagnificPopup'] == 'yes' ? true : false;

    return $this->response($settingData);
  }

  public function updateItem(WP_REST_Request $req)
  {
    global $wpdb;
  }
}
