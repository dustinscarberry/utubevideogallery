<?php

namespace Dscarberry\UTubeVideoGallery\Model;

class Settings implements \JsonSerializable
{
  private $settings;
  private $phpVersion;
  private $wpVersion;
  private $gdEnabled;
  private $gdVersion;
  private $imageMagickEnabled;
  private $imageMagickVersion;
  private $youtubeApiKeyValid;
  private $youtubeApiKeyValidMessage;

  function __construct()
  {
    $this->load();
  }

  function getVersion()
  {
    return $this->settings['version'];
  }

  function setVersion($value)
  {
    $this->settings['version'] = $value;
    return $this;
  }

  function getPopupPlayerWidth()
  {
    return $this->settings['playerWidth'];
  }

  function setPopupPlayerWidth($value)
  {
    $this->settings['playerWidth'] = sanitize_text_field($value);
    return $this;
  }

  function getPlayerControlsColor()
  {
    return $this->settings['playerProgressColor'];
  }

  function setPlayerControlsColor($value)
  {
    $this->settings['playerProgressColor'] = sanitize_text_field($value);
    return $this;
  }

  function getPopupPlayerOverlayOpacity()
  {
    return $this->settings['fancyboxOverlayOpacity'];
  }

  function setPopupPlayerOverlayOpacity($value)
  {
    $this->settings['fancyboxOverlayOpacity'] = sanitize_text_field($value);
    return $this;
  }

  function getPopupPlayerOverlayColor()
  {
    return $this->settings['fancyboxOverlayColor'];
  }

  function setPopupPlayerOverlayColor($value)
  {
    $this->settings['fancyboxOverlayColor'] = sanitize_text_field($value);
    return $this;
  }

  function getThumbnailWidth()
  {
    return $this->settings['thumbnailWidth'];
  }

  function setThumbnailWidth($value)
  {
    $this->settings['thumbnailWidth'] = sanitize_text_field($value);
    return $this;
  }

  function getThumbnailVerticalPadding()
  {
    return $this->settings['thumbnailVerticalPadding'];
  }

  function setThumbnailVerticalPadding($value)
  {
    $this->settings['thumbnailVerticalPadding'] = sanitize_text_field($value);
    return $this;
  }

  function getThumbnailHorizontalPadding()
  {
    return $this->settings['thumbnailPadding'];
  }

  function setThumbnailHorizontalPadding($value)
  {
    $this->settings['thumbnailPadding'] = sanitize_text_field($value);
    return $this;
  }

  function getThumbnailBorderRadius()
  {
    return $this->settings['thumbnailBorderRadius'];
  }

  function setThumbnailBorderRadius($value)
  {
    $this->settings['thumbnailBorderRadius'] = sanitize_text_field($value);
    return $this;
  }

  function getYouTubeApiKey()
  {
    return $this->settings['youtubeApiKey'];
  }

  function setYouTubeApiKey($value)
  {
    $this->settings['youtubeApiKey'] = sanitize_text_field($value);
    return $this;
  }

  function getYouTubeAutoplay()
  {
    return $this->settings['youtubeAutoplay'] ? true : false;
  }

  function setYouTubeAutoplay($value)
  {
    $this->settings['youtubeAutoplay'] = ($value ? 1 : 0);
    return $this;
  }

  function getYouTubeHideDetails()
  {
    return $this->settings['youtubeDetailsHide'] ? true : false;
  }

  function setYouTubeHideDetails($value)
  {
    $this->settings['youtubeDetailsHide'] = ($value ? 1 : 0);
    return $this;
  }

  function getVimeoAutoplay()
  {
    return $this->settings['vimeoAutoplay'] ? true : false;
  }

  function setVimeoAutoplay($value)
  {
    $this->settings['vimeoAutoplay'] = ($value ? 1 : 0);
    return $this;
  }

  function getVimeoHideDetails()
  {
    return $this->settings['vimeoDetailsHide'] ? true : false;
  }

  function setVimeoHideDetails($value)
  {
    $this->settings['vimeoDetailsHide'] = ($value ? 1 : 0);
    return $this;
  }

  function getRemoveVideoPopupScript()
  {
    return $this->settings['skipMagnificPopup'] == 'yes' ? true : false;
  }

  function setRemoveVideoPopupScript($value)
  {
    $this->settings['skipMagnificPopup'] = ($value ? 'yes' : 'no');
    return $this;
  }

  function getShowVideoDescription()
  {
    return $this->settings['showVideoDescription'] ? true : false;
  }

  function setShowVideoDescription($value)
  {
    $this->settings['showVideoDescription'] = ($value ? true : false);
  }

  function getPHPVersion()
  {
    return $this->phpVersion;
  }

  function getWPVersion()
  {
    return $this->wpVersion;
  }

  function getGDEnabled()
  {
    return $this->gdEnabled;
  }

  function getImageMagickEnabled()
  {
    return $this->imageMagickEnabled;
  }

  function getGDVersion()
  {
    return $this->gdVersion;
  }

  function getImageMagickVersion()
  {
    return $this->imageMagickVersion;
  }

  function getYouTubeApiKeyValid()
  {
    return $this->youtubeApiKeyValid;
  }

  function getYouTubeApiKeyValidMessage()
  {
    return $this->youtubeApiKeyValidMessage;
  }

  private function load()
  {
    $this->settings = get_option('utubevideo_main_opts');
    $this->loadDynamicSettings();
  }

  function save()
  {
    return update_option('utubevideo_main_opts', $this->settings);
  }

  private function loadDynamicSettings()
  {
    // get php version
    $this->phpVersion = PHP_VERSION;

    // get WordPress version
    $this->wpVersion = get_bloginfo('version');

    // get gd status
    $this->gdEnabled = extension_loaded('gd');

    // get gd version
    $this->gdVersion = gd_info()['GD Version'];

    // get imagemagick status
    $this->imageMagickEnabled = extension_loaded('imagick');

    // get imagemagick version
    $version = \Imagick::getVersion()['versionString'];
    $version = str_replace('ImageMagick', '', $version);
    $version = str_replace('https://www.imagemagick.org', '', $version);
    $version = str_replace('http://www.imagemagick.org', '', $version);
    $this->imageMagickVersion = trim($version);

    // check api key for validity
    $check = wp_remote_get('https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&key=' . $this->getYouTubeApiKey());
    $check = json_decode($check['body'], true);

    if (isset($check['error'])) {
      $this->youtubeApiKeyValid = false;
      $this->youtubeApiKeyValidMessage = $check['error']['message'];
    } else {
      $this->youtubeApiKeyValid = true;
      $this->youtubeApiKeyValidMessage = 'API Key valid';
    }
  }

  function jsonSerialize()
  {
    return [
      'version' => $this->getVersion(),
      'popupPlayerWidth' => $this->getPopupPlayerWidth(),
      'playerControlsColor' => $this->getPlayerControlsColor(),
      'popupPlayerOverlayOpacity' => $this->getPopupPlayerOverlayOpacity(),
      'popupPlayerOverlayColor' => $this->getPopupPlayerOverlayColor(),
      'thumbnailWidth' => $this->getThumbnailWidth(),
      'thumbnailVerticalPadding' => $this->getThumbnailVerticalPadding(),
      'thumbnailHorizontalPadding' => $this->getThumbnailHorizontalPadding(),
      'thumbnailBorderRadius' => $this->getThumbnailBorderRadius(),
      'youtubeAPIKey' => $this->getYouTubeApiKey(),
      'youtubeAutoplay' => $this->getYouTubeAutoplay(),
      'youtubeHideDetails' => $this->getYouTubeHideDetails(),
      'vimeoAutoplay' => $this->getVimeoAutoplay(),
      'vimeoHideDetails' => $this->getVimeoHideDetails(),
      'removeVideoPopupScript' => $this->getRemoveVideoPopupScript(),
      'showVideoDescription' => $this->getShowVideoDescription(),
      'phpVersion' => $this->getPHPVersion(),
      'wpVersion' => $this->getWPVersion(),
      'gdEnabled' => $this->getGDEnabled(),
      'gdVersion' => $this->getGDVersion(),
      'imageMagickEnabled' => $this->getImageMagickEnabled(),
      'imageMagickVersion' => $this->getImageMagickVersion(),
      'youtubeApiKeyValid' => $this->getYouTubeApiKeyValid(),
      'youtubeApiKeyValidMessage' => $this->getYouTubeApiKeyValidMessage()
    ];
  }
}
