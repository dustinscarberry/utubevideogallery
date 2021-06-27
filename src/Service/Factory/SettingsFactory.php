<?php

namespace Dscarberry\UTubeVideoGallery\Service\Factory;

use Dscarberry\UTubeVideoGallery\Model\Settings;
use Dscarberry\UTubeVideoGallery\Exception\UserMessageException;
use WP_REST_Request;

class SettingsFactory
{
  static function getSettings()
  {
    return new Settings();
  }

  static function updateSettings(WP_REST_Request $req)
  {
    $settings = new Settings();

    if (isset($req['playerControlsColor']))
      $settings->setPlayerControlsColor($req['playerControlsColor']);

    if (isset($req['popupPlayerWidth']) && $req['popupPlayerWidth'] > 0)
      $settings->setPopupPlayerWidth($req['popupPlayerWidth']);

    if (isset($req['popupPlayerOverlayColor']))
      $settings->setPopupPlayerOverlayColor($req['popupPlayerOverlayColor']);

    if (isset($req['popupPlayerOverlayOpacity']))
      $settings->setPopupPlayerOverlayOpacity($req['popupPlayerOverlayOpacity']);

    if (isset($req['thumbnailBorderRadius']))
      $settings->setThumbnailBorderRadius($req['thumbnailBorderRadius']);

    if (isset($req['thumbnailWidth']) && $req['thumbnailWidth'] > 0)
      $settings->setThumbnailWidth($req['thumbnailWidth']);

    if (isset($req['thumbnailHorizontalPadding']))
      $settings->setThumbnailHorizontalPadding($req['thumbnailHorizontalPadding']);

    if (isset($req['thumbnailVerticalPadding']))
      $settings->setThumbnailVerticalPadding($req['thumbnailVerticalPadding']);

    if (isset($req['youtubeAPIKey']))
      $settings->setYouTubeApiKey($req['youtubeAPIKey']);

    if (isset($req['vimeoAutoplay']))
      $settings->setVimeoAutoplay($req['vimeoAutoplay']);

    if (isset($req['vimeoHideDetails']))
      $settings->setVimeoHideDetails($req['vimeoHideDetails']);

    if (isset($req['youtubeAutoplay']))
      $settings->setYouTubeAutoplay($req['youtubeAutoplay']);

    if (isset($req['youtubeHideDetails']))
      $settings->setYouTubeHideDetails($req['youtubeHideDetails']);

    if (isset($req['showVideoDescription']))
      $settings->setShowVideoDescription($req['showVideoDescription']);

    $settings->save();
  }
}
