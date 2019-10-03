<?php

namespace UTubeVideoGallery\Service\Manager;

use UTubeVideoGallery\Model\Settings;
use UTubeVideoGallery\Exception\UserMessageException;

class SettingsManager
{
  public static function getSettings()
  {
    return new Settings();
  }

  public static function updateSettings($form)
  {
    $settings = new Settings();

    if (isset($req['playerControlsColor']))
      $settings->setPlayerControlsColor($req['playerControlsColor']);

    if (isset($req['playerControlsTheme']))
      $settings->setPlayerControlsTheme($req['playerControlsTheme']);

    if (isset($req['popupPlayerWidth'] && $req['popupPlayerWidth'] > 0)
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

    if (isset($req['removeVideoPopupScript']))
      $settings->setRemoveVideoPopupScript($req['removeVideoPopupScript']);

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
