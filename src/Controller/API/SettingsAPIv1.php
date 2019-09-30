<?php

namespace UTubeVideoGallery\Controller\API;

use UTubeVideoGallery\Controller\API\APIv1;
use WP_REST_Request;
use WP_REST_Server;

use UTubeVideoGallery\Model\Settings;

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
    try
    {
      return $this->respond(new Settings());
    }
    catch (\Exception $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }

  public function updateItem(WP_REST_Request $req)
  {
    try
    {
      $pluginSettings = get_option('utubevideo_main_opts');

      //gather data fields
      $playerControlsColor = sanitize_text_field($req['playerControlsColor']);
      $playerControlsTheme = sanitize_text_field($req['playerControlsTheme']);
      $popupPlayerWidth = sanitize_text_field($req['popupPlayerWidth']);
      $popupPlayerOverlayColor = sanitize_text_field($req['popupPlayerOverlayColor']);
      $popupPlayerOverlayOpacity = sanitize_text_field($req['popupPlayerOverlayOpacity']);
      $thumbnailBorderRadius = sanitize_text_field($req['thumbnailBorderRadius']);
      $thumbnailWidth = sanitize_text_field($req['thumbnailWidth']);
      $thumbnailHorizontalPadding = sanitize_text_field($req['thumbnailHorizontalPadding']);
      $thumbnailVerticalPadding = sanitize_text_field($req['thumbnailVerticalPadding']);
      $youtubeAPIKey = sanitize_text_field($req['youtubeAPIKey']);

      if (isset($req['removeVideoPopupScript']))
        $removeVideoPopupScript = $req['removeVideoPopupScript'] ? 'yes' : 'no';
      else
        $removeVideoPopupScript = null;

      if (isset($req['vimeoAutoplay']))
        $vimeoAutoplay = $req['vimeoAutoplay'] ? 1 : 0;
      else
        $vimeoAutoplay = null;

      if (isset($req['vimeoHideDetails']))
        $vimeoHideDetails = $req['vimeoHideDetails'] ? 1 : 0;
      else
        $vimeoHideDetails = null;

      if (isset($req['youtubeAutoplay']))
        $youtubeAutoplay = $req['youtubeAutoplay'] ? 1 : 0;
      else
        $youtubeAutoplay = null;

      if (isset($req['youtubeHideDetails']))
        $youtubeHideDetails = $req['youtubeHideDetails'] ? 1 : 0;
      else
        $youtubeHideDetails = null;

      if (isset($req['showVideoDescription']))
        $showVideoDescription = $req['showVideoDescription'] ? true : false;
      else
        $showVideoDescription = null;

      //set optional update fields
      if ($playerControlsColor)
        $pluginSettings['playerProgressColor'] = $playerControlsColor;

      if ($playerControlsTheme)
        $pluginSettings['playerControlTheme'] = $playerControlsTheme;

      if ($popupPlayerWidth > 0)
        $pluginSettings['playerWidth'] = $popupPlayerWidth;

      if ($popupPlayerOverlayColor)
        $pluginSettings['fancyboxOverlayColor'] = $popupPlayerOverlayColor;

      if ($popupPlayerOverlayOpacity)
        $pluginSettings['fancyboxOverlayOpacity'] = $popupPlayerOverlayOpacity;

      if ($thumbnailBorderRadius !== null)
        $pluginSettings['thumbnailBorderRadius'] = $thumbnailBorderRadius;

      if ($thumbnailWidth > 0)
        $pluginSettings['thumbnailWidth'] = $thumbnailWidth;

      if ($thumbnailHorizontalPadding > 0)
        $pluginSettings['thumbnailPadding'] = $thumbnailHorizontalPadding;

      if ($thumbnailVerticalPadding > 0)
        $pluginSettings['thumbnailVerticalPadding'] = $thumbnailVerticalPadding;

      if ($youtubeAPIKey !== null)
        $pluginSettings['youtubeApiKey'] = $youtubeAPIKey;

      if ($removeVideoPopupScript)
        $pluginSettings['skipMagnificPopup'] = $removeVideoPopupScript;

      if ($vimeoAutoplay !== null)
        $pluginSettings['vimeoAutoplay'] = $vimeoAutoplay;

      if ($vimeoHideDetails !== null)
        $pluginSettings['vimeoDetailsHide'] = $vimeoHideDetails;

      if ($youtubeAutoplay !== null)
        $pluginSettings['youtubeAutoplay'] = $youtubeAutoplay;

      if ($youtubeHideDetails !== null)
        $pluginSettings['youtubeDetailsHide'] = $youtubeHideDetails;

      if ($showVideoDescription !== null)
        $pluginSettings['showVideoDescription'] = $showVideoDescription;

      update_option('utubevideo_main_opts', $pluginSettings);

      return $this->respond(null);
    }
    catch (\Exception $e)
    {
      return $this->respondWithError($e->getMessage());
    }
  }
}
