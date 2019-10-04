<?php

namespace UTubeVideoGallery\Model;

class Settings implements \JsonSerializable
{
  private $settings;
  private $phpVersion;
  private $wpVersion;
  private $gdEnabled;
  private $imageMagickEnabled;

  public function __construct()
  {
    $this->load();
  }

  public function getVersion()
  {
    return $this->settings['version'];
  }

  public function setVersion($value)
  {
    $this->settings['version'] = $value;
    return $this;
  }

  public function getPopupPlayerWidth()
  {
    return $this->settings['playerWidth'];
  }

  public function setPopupPlayerWidth($value)
  {
    $this->settings['playerWidth'] = sanitize_text_field($value);
    return $this;
  }

  public function getPlayerControlsTheme()
  {
    return $this->settings['playerControlTheme'];
  }

  public function setPlayerControlsTheme($value)
  {
    $this->settings['playerControlTheme'] = sanitize_text_field($value);
    return $this;
  }

  public function getPlayerControlsColor()
  {
    return $this->settings['playerProgressColor'];
  }

  public function setPlayerControlsColor($value)
  {
    $this->settings['playerProgressColor'] = sanitize_text_field($value);
    return $this;
  }

  public function getPopupPlayerOverlayOpacity()
  {
    return $this->settings['fancyboxOverlayOpacity'];
  }

  public function setPopupPlayerOverlayOpacity($value)
  {
    $this->settings['fancyboxOverlayOpacity'] = sanitize_text_field($value);
    return $this;
  }

  public function getPopupPlayerOverlayColor()
  {
    return $this->settings['fancyboxOverlayColor'];
  }

  public function setPopupPlayerOverlayColor($value)
  {
    $this->settings['fancyboxOverlayColor'] = sanitize_text_field($value);
    return $this;
  }

  public function getThumbnailWidth()
  {
    return $this->settings['thumbnailWidth'];
  }

  public function setThumbnailWidth($value)
  {
    $this->settings['thumbnailWidth'] = sanitize_text_field($value);
    return $this;
  }

  public function getThumbnailVerticalPadding()
  {
    return $this->settings['thumbnailVerticalPadding'];
  }

  public function setThumbnailVerticalPadding($value)
  {
    $this->settings['thumbnailVerticalPadding'] = sanitize_text_field($value);
    return $this;
  }

  public function getThumbnailHorizontalPadding()
  {
    return $this->settings['thumbnailPadding'];
  }

  public function setThumbnailHorizontalPadding($value)
  {
    $this->settings['thumbnailPadding'] = sanitize_text_field($value);
    return $this;
  }

  public function getThumbnailBorderRadius()
  {
    return $this->settings['thumbnailBorderRadius'];
  }

  public function setThumbnailBorderRadius($value)
  {
    $this->settings['thumbnailBorderRadius'] = sanitize_text_field($value);
    return $this;
  }

  public function getYouTubeApiKey()
  {
    return $this->settings['youtubeApiKey'];
  }

  public function setYouTubeApiKey($value)
  {
    $this->settings['youtubeApiKey'] = sanitize_text_field($value);
    return $this;
  }

  public function getYouTubeAutoplay()
  {
    return $this->settings['youtubeAutoplay'] ? true : false;
  }

  public function setYouTubeAutoplay($value)
  {
    $this->settings['youtubeAutoplay'] = ($value ? 1 : 0);
    return $this;
  }

  public function getYouTubeHideDetails()
  {
    return $this->settings['youtubeDetailsHide'] ? true : false;
  }

  public function setYouTubeHideDetails($value)
  {
    $this->settings['youtubeDetailsHide'] = ($value ? 1 : 0);
    return $this;
  }

  public function getVimeoAutoplay()
  {
    return $this->settings['vimeoAutoplay'] ? true : false;
  }

  public function setVimeoAutoplay($value)
  {
    $this->settings['vimeoAutoplay'] = ($value ? 1 : 0);
    return $this;
  }

  public function getVimeoHideDetails()
  {
    return $this->settings['vimeoDetailsHide'] ? true : false;
  }

  public function setVimeoHideDetails($value)
  {
    $this->settings['vimeoDetailsHide'] = ($value ? 1 : 0);
    return $this;
  }

  public function getRemoveVideoPopupScript()
  {
    return $this->settings['skipMagnificPopup'] == 'yes' ? true : false;
  }

  public function setRemoveVideoPopupScript($value)
  {
    $this->settings['skipMagnificPopup'] = ($value ? 'yes' : 'no');
    return $this;
  }

  public function getShowVideoDescription()
  {
    return $this->settings['showVideoDescription'] ? true : false;
  }

  public function setShowVideoDescription($value)
  {
    $this->settings['showVideoDescription'] = ($value ? true : false);
  }

  public function getPHPVersion()
  {
    return $this->phpVersion;
  }

  public function getWPVersion()
  {
    return $this->wpVersion;
  }

  public function getGDEnabled()
  {
    return $this->gdEnabled;
  }

  public function getImageMagickEnabled()
  {
    return $this->imageMagickEnabled;
  }

  private function load()
  {
    $this->settings = get_option('utubevideo_main_opts');
    $this->loadDynamicSettings();
  }

  public function save()
  {
    return update_option('utubevideo_main_opts', $this->settings);
  }

  private function loadDynamicSettings()
  {
    //get php version
    preg_match('/^(.*?)-(.*)/', PHP_VERSION, $matches);
    $this->phpVersion = isset($matches[1]) ? $matches[1] : '';

    //get WordPress version
    $this->wpVersion = get_bloginfo('version');

    //get gd status
    $this->gdEnabled = extension_loaded('gd');

    //get imagemagick status
    $this->imageMagickEnabled = extension_loaded('imagick');
  }

  public function jsonSerialize()
  {
    return [
      'version' => $this->getVersion(),
      'popupPlayerWidth' => $this->getPopupPlayerWidth(),
      'playerControlsTheme' => $this->getPlayerControlsTheme(),
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
      'imageMagickEnabled' => $this->getImageMagickEnabled()
    ];
  }
}
